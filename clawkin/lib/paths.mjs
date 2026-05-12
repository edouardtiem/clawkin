import { homedir } from 'node:os';
import { join } from 'node:path';

export function clawkinHome() {
  if (process.env.CLAWKIN_HOME) return process.env.CLAWKIN_HOME;
  const xdg = process.env.XDG_CONFIG_HOME;
  const base = xdg && xdg.length > 0 ? xdg : join(homedir(), '.config');
  return join(base, 'clawkin');
}

export function statePath() {
  return join(clawkinHome(), 'state.json');
}

export function cachePath() {
  return join(clawkinHome(), 'cache.json');
}

export function keyPath() {
  return join(clawkinHome(), 'key.enc');
}

export function logPath() {
  return join(clawkinHome(), 'clawkin.log');
}

export function promptsDir() {
  if (process.env.CLAWKIN_PROMPTS_DIR) return process.env.CLAWKIN_PROMPTS_DIR;
  return new URL('../prompts/', import.meta.url).pathname;
}
