
// Enhanced validation utilities with better security

export const sanitizeInput = (input: string, maxLength: number = 10000): string => {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  return input
    .trim()
    .slice(0, maxLength)
    // Enhanced XSS prevention
    .replace(/[<>'"&]/g, (match) => {
      const entities = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[match as keyof typeof entities];
    })
    // Remove potentially dangerous patterns
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:text\/html/gi, '');
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
    ['context', 'task', 'format', 'constraints', 'examples', 'variable', 'conditional', 'loop', 'reference'].includes(block.type)
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

// New validation functions for enhanced security
export const validatePromptContent = (content: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (content.length > 10000) {
    errors.push('Content exceeds maximum length of 10,000 characters');
  }
  
  // Check for potentially dangerous patterns
  const dangerousPatterns = [
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<script/gi,
    /data:text\/html/gi,
    /vbscript:/gi
  ];
  
  dangerousPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      errors.push('Content contains potentially unsafe patterns');
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9\-_\.]/g, '_')
    .replace(/_{2,}/g, '_')
    .slice(0, 100);
};
