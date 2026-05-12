import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { clawkinHome, statePath } from './paths.mjs';

const STATE_VERSION = '1.0';
const DISPATCH_RETENTION_DAYS = 30;

function emptyState() {
  return {
    version: STATE_VERSION,
    user_id: randomUUID(),
    install_date: new Date().toISOString(),
    baseline_complete_at: null,
    subscription_status: 'trial',
    subscription_email: null,
    current_month_savings_cents: 0,
    current_month_start: monthStart(new Date()).toISOString(),
    lifetime_savings_cents: 0,
    dispatches: [],
    patterns_calibration: {
      bash_threshold_lines: 200,
      read_threshold_lines: 500,
      grep_threshold_matches: 10,
    },
  };
}

function monthStart(d) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

export async function readState() {
  const path = statePath();
  try {
    const raw = await readFile(path, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return emptyState();
    throw err;
  }
}

export async function writeState(state) {
  const path = statePath();
  await mkdir(dirname(path), { recursive: true });
  const tmp = `${path}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmp, JSON.stringify(state, null, 2), { mode: 0o600 });
  await rename(tmp, path);
}

export async function updateState(mutator) {
  const current = await readState();
  const next = mutator(current) ?? current;
  await writeState(next);
  return next;
}

export function recordDispatch(state, dispatch) {
  const now = new Date(dispatch.ts);
  const monthAnchor = new Date(state.current_month_start);
  if (now.getUTCFullYear() !== monthAnchor.getUTCFullYear() ||
      now.getUTCMonth() !== monthAnchor.getUTCMonth()) {
    state.current_month_savings_cents = 0;
    state.current_month_start = monthStart(now).toISOString();
  }

  state.current_month_savings_cents += dispatch.savings_cents;
  state.lifetime_savings_cents += dispatch.savings_cents;
  state.dispatches.push(dispatch);

  const cutoff = Date.now() - DISPATCH_RETENTION_DAYS * 86_400_000;
  state.dispatches = state.dispatches.filter(d => new Date(d.ts).getTime() >= cutoff);
  return state;
}

export { STATE_VERSION, emptyState, monthStart };
export { clawkinHome };
