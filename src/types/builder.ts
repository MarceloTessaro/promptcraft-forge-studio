
export interface PromptBlock {
  id: string;
  type: 'context' | 'task' | 'format' | 'constraints' | 'examples' | 'variable' | 'conditional' | 'loop' | 'reference';
  content: string;
  placeholder: string;
  // Propiedades específicas para bloques avanzados
  variableName?: string; // Para bloques de variable
  condition?: string; // Para bloques condicionales
  loopVariable?: string; // Para bloques de loop
  loopCount?: number; // Para bloques de loop
  referenceId?: string; // Para bloques de referencia
  isActive?: boolean; // Para condicionales
}

export interface CustomTemplate {
  id: string;
  name: string;
  blocks: PromptBlock[];
  createdAt: string;
}

export interface VariableDefinition {
  name: string;
  value: string;
  type: 'text' | 'number' | 'boolean' | 'list';
  description?: string;
}
