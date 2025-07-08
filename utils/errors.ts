/**
 * Secure error handling utilities
 */

export interface SecureError {
  success: false;
  message: string;
  code?: string;
}

/**
 * Create a safe error response that doesn't leak internal details
 */
export function createSecureErrorResponse(
  error: unknown, 
  defaultMessage: string = 'An error occurred',
  includeDetails: boolean = false
): SecureError {
  
  // In development, we might want more details
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (error instanceof Error) {
    // Log the full error for debugging
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Return sanitized error message
    if (isDevelopment && includeDetails) {
      return {
        success: false,
        message: error.message
      };
    }
  }
  
  // Generic error message for production
  return {
    success: false,
    message: defaultMessage
  };
}

/**
 * Validation error that's safe to show to users
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Authentication error that's safe to show to users
 */
export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Rate limiting error
 */
export class RateLimitError extends Error {
  constructor(message: string = 'Too many requests') {
    super(message);
    this.name = 'RateLimitError';
  }
}
