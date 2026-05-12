import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { routeBashPostTool, OUTCOMES } from '../lib/router.mjs';
import { createMockDispatcher } from '../lib/haiku-dispatch.mjs';
import { readState } from '../lib/state.mjs';

function bigBash(lines) {
  return Array.from({ length: lines }, (_, i) => `log line ${i} ok`).join('\n');
}

beforeEach(async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'clawkin-router-'));
  process.env.CLAWKIN_HOME = sandbox;
});

test('intercepts long clean bash and persists dispatch', async () => {
  const result = await routeBashPostTool({
    tool_input: { command: 'npm install' },
    tool_response: { stdout: bigBash(400), stderr: '' },
    apiKey: 'k',
    dispatcher: createMockDispatcher({ summary: 'ok' }),
  });

  assert.equal(result.outcome, OUTCOMES.INTERCEPTED);
  assert.equal(result.decision.pattern, 'bash_truncate');
  assert.ok(result.dispatch.tokens_intercepted > result.dispatch.tokens_delivered);

  const state = await readState();
  assert.equal(state.dispatches.length, 1);
  assert.equal(state.dispatches[0].pattern, 'bash_truncate');
});

test('skips when output is short', async () => {
  const result = await routeBashPostTool({
    tool_input: { command: 'ls' },
    tool_response: { stdout: bigBash(20), stderr: '' },
    apiKey: 'k',
    dispatcher: createMockDispatcher(),
  });
  assert.equal(result.outcome, OUTCOMES.SKIPPED);
});

test('skips when error markers in tail', async () => {
  const result = await routeBashPostTool({
    tool_input: { command: 'pytest' },
    tool_response: { stdout: bigBash(400) + '\nError: tests failed', stderr: '' },
    apiKey: 'k',
    dispatcher: createMockDispatcher(),
  });
  assert.equal(result.outcome, OUTCOMES.SKIPPED);
});

test('returns SKIPPED no_api_key when key missing and dispatcher would have run', async () => {
  const result = await routeBashPostTool({
    tool_input: { command: 'npm install' },
    tool_response: { stdout: bigBash(400), stderr: '' },
    apiKey: null,
    dispatcher: createMockDispatcher(),
  });
  assert.equal(result.outcome, OUTCOMES.SKIPPED);
  assert.equal(result.reason, 'no_api_key');
});

test('captures dispatcher errors as ERROR outcome', async () => {
  const failing = async () => { throw new Error('boom'); };
  const result = await routeBashPostTool({
    tool_input: { command: 'npm install' },
    tool_response: { stdout: bigBash(400), stderr: '' },
    apiKey: 'k',
    dispatcher: failing,
  });
  assert.equal(result.outcome, OUTCOMES.ERROR);
  assert.match(result.error, /boom/);
});
