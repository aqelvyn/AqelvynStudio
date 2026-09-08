// Server-side unlock ledger with a portable backend:
//   1. Upstash / Vercel KV (KV_REST_API_URL + KV_REST_API_TOKEN) — the right
//      choice for serverless free hosts (Vercel, Netlify, Cloudflare) where the
//      filesystem is ephemeral/read-only.
//   2. Local JSON file — for long-running hosts with a persistent disk
//      (Render, Railway, Fly.io).
//   3. In-memory — last-resort fallback (unlocks do NOT survive a restart).
// The on-chain transaction is ALWAYS verified regardless of backend.

import { promises as fs } from 'fs';
import path from 'path';

export interface UnlockRecord {
  address: string; // paying wallet (lowercase)
  key: string;     // e.g. "app:app-000" or "unlock-all"
  tx: string;
  at: number;
}

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

// ---------------- KV backend (Upstash REST-compatible) ----------------
async function kvCall(command: [string, ...unknown[]]): Promise<any> {
  const res = await fetch(KV_URL!, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([command]),
  });
  const data = await res.json();
  return data?.result?.[0];
}

const kvKey = (address: string) => `aq:unlocks:${address.toLowerCase()}`;

// ---------------- file backend ----------------
const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'unlocks.json');

// ---------------- memory backend ----------------
const mem = new Map<string, UnlockRecord[]>();

async function readAll(address: string): Promise<UnlockRecord[]> {
  const a = address.toLowerCase();
  if (KV_URL && KV_TOKEN) {
    const raw = await kvCall(['GET', kvKey(a)]);
    try { return raw ? (JSON.parse(raw) as UnlockRecord[]) : []; } catch { return []; }
  }
  if (process.env.DISABLE_FILE_STORE !== '1') {
    try {
      const rows: Record<string, UnlockRecord> = JSON.parse(await fs.readFile(FILE, 'utf-8'));
      const prefix = a + ':';
      return Object.keys(rows)
        .filter((k) => k.startsWith(prefix))
        .map((k) => rows[k]);
    } catch {
      return [];
    }
  }
  return mem.get(a) || [];
}

async function writeAll(address: string, records: UnlockRecord[]): Promise<void> {
  const a = address.toLowerCase();
  if (KV_URL && KV_TOKEN) {
    await kvCall(['SET', kvKey(a), JSON.stringify(records)]);
    return;
  }
  if (process.env.DISABLE_FILE_STORE !== '1') {
    let rows: Record<string, UnlockRecord> = {};
    try { rows = JSON.parse(await fs.readFile(FILE, 'utf-8')); } catch {}
    // remove this address's existing entries, then re-add
    const prefix = a + ':';
    for (const k of Object.keys(rows)) if (k.startsWith(prefix)) delete rows[k];
    for (const r of records) rows[`${a}:${r.key}`] = r;
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(rows, null, 2));
    return;
  }
  mem.set(a, records);
}

export async function getUnlock(address: string, key: string): Promise<UnlockRecord | null> {
  const records = await readAll(address);
  if (key !== 'unlock-all') {
    return records.find((r) => r.key === 'unlock-all') || records.find((r) => r.key === key) || null;
  }
  return records.find((r) => r.key === 'unlock-all') || null;
}

export async function setUnlock(record: UnlockRecord) {
  const records = await readAll(record.address);
  const existing = records.filter((r) => r.key !== record.key);
  existing.push(record);
  await writeAll(record.address, existing);
}

export async function listUnlocks(address: string): Promise<UnlockRecord[]> {
  return readAll(address);
}
