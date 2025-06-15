
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PromptBlock } from '@/types/builder';
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
  const { handleError } = useErrorHandler();

  const addBlock = useCallback((type: PromptBlock['type']) => {
    try {
      const newBlock = {
        id: uuidv4(),
        type: type,
        content: '',
        placeholder: `Enter your ${type} here...`,
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

  const assemblePrompt = useCallback(() => {
    try {
      let prompt = '';
      let vars: string[] = [];

      blocks.forEach(block => {
        const content = block.content;
        const matches = content.matchAll(/{{(.*?)}}/g);

        let blockContent = content;
        if (matches) {
          for (const match of matches) {
            const variable = match[1].trim();
            vars.push(variable);
          }
          blockContent = content.replace(/{{(.*?)}}/g, (match, variable) => {
            const varName = variable.trim();
            return variableValues[varName] || `{{${varName}}}`;
          });
        }
        prompt += blockContent + '\n\n';
      });

      setAssembledPrompt(prompt.trim());
      setVariables([...new Set(vars)]);
    } catch (error) {
      handleError(error, 'Assembling prompt');
    }
  }, [blocks, variableValues, handleError]);

  useEffect(() => {
    assemblePrompt();
  }, [blocks, variableValues, assemblePrompt]);

  return {
    blocks,
    assembledPrompt,
    variables,
    variableValues,
    addBlock,
    removeBlock,
    updateBlockContent,
    clearDraft,
    handleVariableChange,
    setBlocks,
  };
};
