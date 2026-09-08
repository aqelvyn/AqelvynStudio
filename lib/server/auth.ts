// SERVER-ONLY SiWE-style authentication. Stateless HMAC-signed nonces and
// session tokens (portable across serverless deployments — no database needed).

import { createHmac } from 'crypto';

const SECRET = () => process.env.VERIFY_SECRET || 'dev-only-insecure-secret';
const NONCE_TTL = 5 * 60 * 1000;        // 5 minutes
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

function hmac(data: string): string {
  return createHmac('sha256', SECRET()).update(data).digest('hex');
}

export function buildMessage(address: string, nonce: string): string {
  return `AQELVYN Studio sign-in\nWallet: ${address}\nNonce: ${nonce}`;
}

export function issueNonce(address: string): { nonce: string } {
  const exp = Date.now() + NONCE_TTL;
  const payload = Buffer.from(`${address.toLowerCase()}:${exp}`).toString('base64url');
  return { nonce: `${payload}.${hmac(payload)}` };
}

export function verifyNonce(address: string, nonce: string): boolean {
  const [payload, sig] = (nonce || '').split('.');
  if (!payload || !sig) return false;
  if (hmac(payload) !== sig) return false;
  let decoded: string;
  try { decoded = Buffer.from(payload, 'base64url').toString(); } catch { return false; }
  const [addr, expStr] = decoded.split(':');
  if (addr.toLowerCase() !== address.toLowerCase()) return false;
  const exp = parseInt(expStr, 10);
  if (!exp || Date.now() > exp) return false;
  return true;
}

export function issueSession(address: string): string {
  const exp = Date.now() + SESSION_TTL;
  const payload = Buffer.from(`${address.toLowerCase()}:${exp}`).toString('base64url');
  return `${payload}.${hmac(payload)}`;
}

export function verifySession(token: string | null | undefined): string | null {
  const [payload, sig] = (token || '').split('.');
  if (!payload || !sig) return null;
  if (hmac(payload) !== sig) return null;
  let decoded: string;
  try { decoded = Buffer.from(payload, 'base64url').toString(); } catch { return null; }
  const [addr, expStr] = decoded.split(':');
  const exp = parseInt(expStr, 10);
  if (!exp || Date.now() > exp) return null;
  return addr.toLowerCase();
}

export function getSessionAddress(req: Request): string | null {
  const header = req.headers.get('authorization') || '';
  const token = header.replace(/^Bearer\s+/i, '').trim();
  return verifySession(token);
}
