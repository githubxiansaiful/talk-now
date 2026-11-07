import crypto from 'crypto';

// Non-ambiguous lowercase alphanumeric charset (excluding 0, o, 1, l, i)
const CHARSET = '23456789abcdefghjkmnpqrstuvwxyz';

/**
 * Generates a cryptographically secure random room code formatted as 'xxxx-xxxx'
 */
export function generateRoomCode(length: number = 8): string {
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CHARSET[bytes[i] % CHARSET.length];
  }
  // Format as xxxx-xxxx if length >= 6
  if (length === 8) {
    return `${result.slice(0, 4)}-${result.slice(4)}`;
  }
  return result;
}

/**
 * Hashes a token using SHA-256
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generates a random session token
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
