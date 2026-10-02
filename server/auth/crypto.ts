import crypto from 'crypto';

function getSecretKey(): string {
  const secret = process.env.AUTH_SECRET?.trim();
  if (secret && secret.length >= 16) {
    return secret;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'CRITICAL SECURITY ERROR: AUTH_SECRET environment variable is missing or insecure! In production on Hostinger, define a strong 32+ character AUTH_SECRET in your environment variables.'
    );
  }
  return 'xing-fitness-dev-secret-do-not-use-in-production-only';
}

/**
 * Hash password using PBKDF2 with SHA-512, 100,000 iterations, and random 32-byte salt
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

/**
 * Verify password against stored hash and salt using timing-safe comparison
 */
export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    const hashBuffer = Buffer.from(hash, 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');
    if (hashBuffer.length !== storedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(hashBuffer, storedBuffer);
  } catch {
    return false;
  }
}

/**
 * Generate a cryptographically secure random token (e.g. for reset tokens)
 */
export function generateRandomToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Simple signed session token (Header.Payload.Signature) with HMAC-SHA256
 */
export function createSessionToken(payload: { userId: string; role: string; email: string; exp: number }): string {
  const key = getSecretKey();
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', key).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifySessionToken(token: string): { userId: string; role: string; email: string } | null {
  try {
    const key = getSecretKey();
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', key).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }
    return {
      userId: payload.userId,
      role: payload.role,
      email: payload.email
    };
  } catch {
    return null;
  }
}
