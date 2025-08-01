import crypto from 'crypto';

// Secure admin key management
const ADMIN_KEY = process.env.ADMIN_KEY || (() => {
  console.warn('⚠️ ADMIN_KEY not set in environment variables. Using fallback.');
  return 'kala-admin-2024'; // Fallback for development only
})();

// Rate limiting for authentication attempts
const authAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 10; // Increased from 5 to 10
const LOCKOUT_DURATION = 5 * 60 * 1000; // Reduced from 15 to 5 minutes

/**
 * Validates admin key with rate limiting
 * @param providedKey - The admin key to validate
 * @param clientIP - Client IP address for rate limiting
 * @returns true if valid, false otherwise
 */
export function validateAdminKey(providedKey: string, clientIP: string = 'unknown'): boolean {
  // In development, be more lenient with rate limiting
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Check rate limiting
  const attempts = authAttempts.get(clientIP);
  const now = Date.now();
  
  if (attempts && !isDevelopment) {
    if (attempts.count >= MAX_ATTEMPTS && (now - attempts.lastAttempt) < LOCKOUT_DURATION) {
      throw new Error('Too many authentication attempts. Please try again later.');
    }
    
    // Reset attempts if lockout period has passed
    if ((now - attempts.lastAttempt) >= LOCKOUT_DURATION) {
      authAttempts.delete(clientIP);
    }
  }
  
  // Simple comparison first to avoid buffer length issues
  if (!providedKey || !ADMIN_KEY || providedKey.length !== ADMIN_KEY.length) {
    // Track failed attempts (but not in development for easier debugging)
    if (!isDevelopment) {
      const currentAttempts = authAttempts.get(clientIP) || { count: 0, lastAttempt: 0 };
      authAttempts.set(clientIP, {
        count: currentAttempts.count + 1,
        lastAttempt: now
      });
    }
    return false;
  }
  
  try {
    // Constant-time comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(providedKey, 'utf8'),
      Buffer.from(ADMIN_KEY, 'utf8')
    );
    
    if (!isValid && !isDevelopment) {
      // Track failed attempts (but not in development)
      const currentAttempts = authAttempts.get(clientIP) || { count: 0, lastAttempt: 0 };
      authAttempts.set(clientIP, {
        count: currentAttempts.count + 1,
        lastAttempt: now
      });
    } else if (isValid) {
      // Clear attempts on successful authentication
      authAttempts.delete(clientIP);
    }
    
    return isValid;
  } catch (error) {
    console.error('Admin key validation error:', error);
    // Track failed attempts (but not in development)
    if (!isDevelopment) {
      const currentAttempts = authAttempts.get(clientIP) || { count: 0, lastAttempt: 0 };
      authAttempts.set(clientIP, {
        count: currentAttempts.count + 1,
        lastAttempt: now
      });
    }
    return false;
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}
