import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { routeBashPostTool, OUTCOMES } from '../lib/router.mjs';
import { readState } from '../lib/state.mjs';

function bigBash(lines) {
  return Array.from({ length: lines }, (_, i) => `log line ${i} ok`).join('\n');
}

beforeEach(async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'clawkin-router-'));
  process.env.CLAWKIN_HOME = sandbox;
});

test('intercepts long clean safe-command bash and persists dispatch', async () => {
  const result = await routeBashPostTool({
    tool_input: { command: 'npm install' },
    tool_response: { stdout: bigBash(400), stderr: '' },
  });
  assert.equal(result.outcome, OUTCOMES.INTERCEPTED);
  assert.equal(result.decision.pattern, 'bash_truncate');
  assert.ok(result.dispatch.tokens_intercepted > result.dispatch.tokens_delivered);
  assert.ok(result.dispatch.lines_removed > 0);

  const state = await readState();
  assert.equal(state.dispatches.length, 1);
  assert.equal(state.dispatches[0].pattern, 'bash_truncate');
});

test('skips when output is short', async () => {
  const result = await routeBashPostTool({
    tool_input: { command: 'npm install' },
    tool_response: { stdout: bigBash(20), stderr: '' },
  });
  assert.equal(result.outcome, OUTCOMES.SKIPPED);
});

test('skips when command is not in safe allowlist', async () => {
  const result = await routeBashPostTool({
    tool_input: { command: 'git log --oneline' },
    tool_response: { stdout: bigBash(400), stderr: '' },
  });
  assert.equal(result.outcome, OUTCOMES.SKIPPED);
  assert.equal(result.decision.reason, 'command_not_in_safe_allowlist');
});

test('skips when error markers in tail', async () => {
  const result = await routeBashPostTool({
    tool_input: { command: 'pytest' },
    tool_response: { stdout: bigBash(400) + '\nError: tests failed', stderr: '' },
  });
  assert.equal(result.outcome, OUTCOMES.SKIPPED);
  assert.equal(result.decision.reason, 'bash_output_contains_error_markers');
});

test('does not persist when persist:false', async () => {
  const result = await routeBashPostTool({
    tool_input: { command: 'npm install' },
    tool_response: { stdout: bigBash(400), stderr: '' },
    persist: false,
  });
  assert.equal(result.outcome, OUTCOMES.INTERCEPTED);
  const state = await readState();
  assert.equal(state.dispatches.length, 0);
});
