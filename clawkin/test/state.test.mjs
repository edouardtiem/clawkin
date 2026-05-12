import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readState, writeState, updateState, recordDispatch } from '../lib/state.mjs';

let sandbox;
beforeEach(async () => {
  sandbox = await mkdtemp(join(tmpdir(), 'clawkin-test-'));
  process.env.CLAWKIN_HOME = sandbox;
});

test('readState returns fresh empty state when file is absent', async () => {
  const s = await readState();
  assert.equal(s.version, '1.0');
  assert.equal(s.subscription_status, 'trial');
  assert.equal(s.dispatches.length, 0);
});

test('writeState then readState round-trips', async () => {
  const s = await readState();
  s.subscription_email = 'a@b.com';
  await writeState(s);
  const reloaded = await readState();
  assert.equal(reloaded.subscription_email, 'a@b.com');
});

test('updateState mutates atomically', async () => {
  const next = await updateState(s => {
    s.lifetime_savings_cents += 42;
  });
  assert.equal(next.lifetime_savings_cents, 42);
  const reloaded = await readState();
  assert.equal(reloaded.lifetime_savings_cents, 42);
});

test('recordDispatch adds savings and keeps recent dispatches', async () => {
  await updateState(s => {
    recordDispatch(s, {
      ts: new Date().toISOString(),
      pattern: 'bash_truncate',
      tokens_intercepted: 1000,
      tokens_delivered: 50,
      savings_cents: 12,
    });
  });
  const s = await readState();
  assert.equal(s.current_month_savings_cents, 12);
  assert.equal(s.lifetime_savings_cents, 12);
  assert.equal(s.dispatches.length, 1);
});

test('recordDispatch resets month bucket on month rollover', async () => {
  await updateState(s => {
    s.current_month_start = new Date(Date.UTC(2026, 0, 1)).toISOString();
    s.current_month_savings_cents = 999;
    recordDispatch(s, {
      ts: new Date(Date.UTC(2026, 1, 5)).toISOString(),
      pattern: 'bash_truncate',
      savings_cents: 7,
    });
  });
  const s = await readState();
  assert.equal(s.current_month_savings_cents, 7);
  assert.equal(s.lifetime_savings_cents, 7);
});
