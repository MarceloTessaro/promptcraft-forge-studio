
export const sanitizeInput = (input: string, maxLength: number = 10000): string => {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Basic XSS prevention
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePromptBlock = (block: any): boolean => {
  return (
    block &&
    typeof block === 'object' &&
    typeof block.id === 'string' &&
    typeof block.type === 'string' &&
    typeof block.content === 'string' &&
    typeof block.placeholder === 'string' &&
    ['context', 'task', 'format', 'constraints', 'examples'].includes(block.type)
  );
};

export const validateTemplate = (template: any): boolean => {
  return (
    template &&
    typeof template === 'object' &&
    typeof template.id === 'string' &&
    typeof template.name === 'string' &&
    Array.isArray(template.blocks) &&
    template.blocks.every(validatePromptBlock) &&
    typeof template.createdAt === 'string'
  );
};
