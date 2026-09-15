import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// scrypt over bcrypt/argon2 so we don't add a native dependency for a
// free-tier deploy — Node's built-in crypto covers this fine.
const KEY_LENGTH = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const candidate = scryptSync(password, salt, KEY_LENGTH);
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}
