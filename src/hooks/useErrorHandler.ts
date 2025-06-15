
import { useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorDetails {
  message: string;
  code?: string;
  context?: string;
}

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown, context?: string) => {
    console.error(`Error in ${context || 'unknown context'}:`, error);
    
    let errorMessage = 'An unexpected error occurred';
    let errorCode = 'UNKNOWN_ERROR';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorCode = error.name;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }

    // Show user-friendly error message
    toast.error(errorMessage, {
      description: context ? `Error in: ${context}` : undefined,
      duration: 5000,
    });

    // Log detailed error for debugging
    const errorDetails: ErrorDetails = {
      message: errorMessage,
      code: errorCode,
      context: context || 'unknown',
    };

    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: sendToErrorTracking(errorDetails);
    }

    return errorDetails;
  }, []);

  const handleAsyncError = useCallback(async (
    asyncFn: () => Promise<any>,
    context?: string
  ) => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, context);
      throw error; // Re-throw so caller can handle if needed
    }
  }, [handleError]);

  return { handleError, handleAsyncError };
};
