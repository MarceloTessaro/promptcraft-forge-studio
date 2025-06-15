
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PromptBlock, VariableDefinition } from '@/types/builder';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { logger } from '@/utils/logger';
import { sanitizeInput, validatePromptBlock } from '@/utils/validation';

export const usePromptBuilder = () => {
  const [blocks, setBlocks] = useState<PromptBlock[]>([
    {
      id: uuidv4(),
      type: 'context',
      content: '',
      placeholder: 'Provide background information to the AI...',
    },
    {
      id: uuidv4(),
      type: 'task',
      content: '',
      placeholder: 'Clearly define the task you want the AI to perform...',
    },
  ]);
  const [assembledPrompt, setAssembledPrompt] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [definedVariables, setDefinedVariables] = useState<VariableDefinition[]>([]);
  const { handleError } = useErrorHandler();

  const addBlock = useCallback((type: PromptBlock['type']) => {
    try {
      const placeholders: Record<PromptBlock['type'], string> = {
        context: 'Provide background information to the AI...',
        task: 'Clearly define the task you want the AI to perform...',
        format: 'Specify the desired output format...',
        constraints: 'Define rules and limitations...',
        examples: 'Provide examples of expected input/output...',
        variable: 'Define a variable: {{variable_name}} = default_value',
        conditional: 'Content to show when condition is met...',
        loop: 'Content to repeat for each iteration...',
        reference: 'Reference another block...'
      };

      const newBlock: PromptBlock = {
        id: uuidv4(),
        type: type,
        content: '',
        placeholder: placeholders[type],
        // Initialize advanced properties
        ...(type === 'variable' && { variableName: '' }),
        ...(type === 'conditional' && { condition: '', isActive: false }),
        ...(type === 'loop' && { loopVariable: '', loopCount: 1 }),
        ...(type === 'reference' && { referenceId: '' }),
      };

      if (!validatePromptBlock(newBlock)) {
        throw new Error('Invalid block data');
      }

      setBlocks(prevBlocks => [...prevBlocks, newBlock]);
      logger.info('Block added successfully', 'PromptBuilder', { type });
    } catch (error) {
      handleError(error, 'Adding block');
    }
  }, [handleError]);

  const removeBlock = useCallback((id: string) => {
    try {
      setBlocks(prevBlocks => {
        const newBlocks = prevBlocks.filter(block => block.id !== id);
        if (newBlocks.length === prevBlocks.length) {
          throw new Error('Block not found');
        }
        return newBlocks;
      });
      logger.info('Block removed successfully', 'PromptBuilder', { id });
    } catch (error) {
      handleError(error, 'Removing block');
    }
  }, [handleError]);

  const updateBlockContent = useCallback((id: string, content: string) => {
    try {
      const sanitizedContent = sanitizeInput(content, 5000);
      
      setBlocks(prevBlocks =>
        prevBlocks.map(block =>
          block.id === id ? { ...block, content: sanitizedContent } : block
        )
      );
    } catch (error) {
      handleError(error, 'Updating block content');
    }
  }, [handleError]);

  const updateBlockProperty = useCallback((id: string, property: keyof PromptBlock, value: any) => {
    try {
      setBlocks(prevBlocks =>
        prevBlocks.map(block =>
          block.id === id ? { ...block, [property]: value } : block
        )
      );
      logger.info('Block property updated', 'PromptBuilder', { id, property });
    } catch (error) {
      handleError(error, 'Updating block property');
    }
  }, [handleError]);

  const clearDraft = useCallback(() => {
    try {
      setBlocks([
        {
          id: uuidv4(),
          type: 'context',
          content: '',
          placeholder: 'Provide background information to the AI...',
        },
        {
          id: uuidv4(),
          type: 'task',
          content: '',
          placeholder: 'Clearly define the task you want the AI to perform...',
        },
      ]);
      setDefinedVariables([]);
      logger.info('Draft cleared', 'PromptBuilder');
    } catch (error) {
      handleError(error, 'Clearing draft');
    }
  }, [handleError]);

  const handleVariableChange = useCallback((variable: string, value: string) => {
    try {
      const sanitizedValue = sanitizeInput(value, 1000);
      setVariableValues(prevValues => ({ ...prevValues, [variable]: sanitizedValue }));
    } catch (error) {
      handleError(error, 'Updating variable');
    }
  }, [handleError]);

  const processAdvancedBlocks = useCallback((blocks: PromptBlock[], variableValues: Record<string, string>) => {
    let processedPrompt = '';
    const extractedVariables: string[] = [];
    const variableDefinitions: VariableDefinition[] = [];

    blocks.forEach(block => {
      let blockContent = block.content;

      // Process different block types
      switch (block.type) {
        case 'variable':
          // Extract variable definitions
          if (block.variableName && block.content) {
            variableDefinitions.push({
              name: block.variableName,
              value: block.content,
              type: 'text',
              description: `Variable defined in block`
            });
          }
          // Don't include variable blocks in final prompt
          return;

        case 'conditional':
          // Only include if condition is met or isActive is true
          if (!block.isActive && block.condition) {
            // Simple condition evaluation (could be enhanced)
            const conditionMet = evaluateCondition(block.condition, variableValues);
            if (!conditionMet) return;
          }
          break;

        case 'loop':
          // Repeat content based on loop configuration
          if (block.loopCount && block.loopVariable) {
            let loopContent = '';
            for (let i = 1; i <= block.loopCount; i++) {
              const iterationContent = blockContent.replace(
                new RegExp(`{{${block.loopVariable}}}`, 'g'),
                i.toString()
              );
              loopContent += iterationContent + '\n';
            }
            blockContent = loopContent.trim();
          }
          break;

        case 'reference':
          // Replace with referenced block content
          if (block.referenceId) {
            const referencedBlock = blocks.find(b => b.id === block.referenceId);
            if (referencedBlock) {
              blockContent = referencedBlock.content;
            }
          }
          break;
      }

      // Extract variables from content
      const matches = blockContent.matchAll(/{{(.*?)}}/g);
      if (matches) {
        for (const match of matches) {
          const variable = match[1].trim();
          extractedVariables.push(variable);
        }
      }

      // Replace variables with values
      blockContent = blockContent.replace(/{{(.*?)}}/g, (match, variable) => {
        const varName = variable.trim();
        return variableValues[varName] || variableDefinitions.find(v => v.name === varName)?.value || `{{${varName}}}`;
      });

      processedPrompt += blockContent + '\n\n';
    });

    setDefinedVariables(variableDefinitions);
    return {
      prompt: processedPrompt.trim(),
      variables: [...new Set(extractedVariables)]
    };
  }, []);

  // Simple condition evaluator (could be enhanced with a proper parser)
  const evaluateCondition = useCallback((condition: string, values: Record<string, string>): boolean => {
    try {
      // Replace variables in condition
      let evaluableCondition = condition.replace(/{{(.*?)}}/g, (match, variable) => {
        const varName = variable.trim();
        const value = values[varName] || '';
        return `"${value}"`;
      });

      // Simple evaluation for basic conditions
      // This is a simplified version - in production, you'd want a proper expression parser
      if (evaluableCondition.includes('==')) {
        const [left, right] = evaluableCondition.split('==').map(s => s.trim().replace(/"/g, ''));
        return left === right;
      }
      if (evaluableCondition.includes('!=')) {
        const [left, right] = evaluableCondition.split('!=').map(s => s.trim().replace(/"/g, ''));
        return left !== right;
      }
      
      return false;
    } catch (error) {
      logger.warn('Error evaluating condition', 'PromptBuilder', { condition, error });
      return false;
    }
  }, []);

  const assemblePrompt = useCallback(() => {
    try {
      const result = processAdvancedBlocks(blocks, variableValues);
      setAssembledPrompt(result.prompt);
      setVariables(result.variables);
    } catch (error) {
      handleError(error, 'Assembling prompt');
    }
  }, [blocks, variableValues, processAdvancedBlocks, handleError]);

  useEffect(() => {
    assemblePrompt();
  }, [blocks, variableValues, assemblePrompt]);

  return {
    blocks,
    assembledPrompt,
    variables,
    variableValues,
    definedVariables,
    addBlock,
    removeBlock,
    updateBlockContent,
    updateBlockProperty,
    clearDraft,
    handleVariableChange,
    setBlocks,
  };
};
