import { readFile } from 'node:fs/promises';
import { keyPath } from './paths.mjs';

export async function loadApiKey() {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY.trim();
  if (process.env.CLAWKIN_API_KEY) return process.env.CLAWKIN_API_KEY.trim();
  try {
    const raw = await readFile(keyPath(), 'utf8');
    return raw.trim();
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}
