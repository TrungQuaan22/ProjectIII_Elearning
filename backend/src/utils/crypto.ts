import { createHash } from 'node:crypto'

/**
 * Returns a SHA256 hash using SHA-3 for the given `content`.
 *
 * @see https://en.wikipedia.org/wiki/SHA-3
 *
 * @param {String} content
 *
 * @returns {String}
 */
export function sha256(content: string): string {
  return createHash('sha3-256').update(content).digest('hex')
}
export function hashPassword(password: string) {
  return sha256(password + process.env.PASSWORD_SECRET)
}
