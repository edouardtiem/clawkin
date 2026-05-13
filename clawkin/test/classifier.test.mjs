import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classify } from '../lib/classifier.mjs';

function lines(n, prefix = 'line') {
  return Array.from({ length: n }, (_, i) => `${prefix} ${i}`).join('\n');
}

test('returns null for short bash output', () => {
  const r = classify({ name: 'Bash', command: 'npm install', result: lines(50) });
  assert.equal(r, null);
});

test('flags bash_truncate for long clean output of safe command', () => {
  const r = classify({ name: 'Bash', command: 'npm install', result: lines(250) });
  assert.equal(r.pattern, 'bash_truncate');
  assert.equal(r.confidence, 'high');
  assert.equal(r.metrics.line_count, 250);
});

test('skips long output when command is not in safe allowlist', () => {
  const r = classify({ name: 'Bash', command: 'git log --oneline', result: lines(250) });
  assert.equal(r.pattern, null);
  assert.equal(r.reason, 'command_not_in_safe_allowlist');
});

test('skips when last 20 lines contain error markers', () => {
  const r = classify({
    name: 'Bash',
    command: 'pytest',
    result: lines(250) + '\nError: tests failed',
  });
  assert.equal(r.pattern, null);
  assert.equal(r.reason, 'bash_output_contains_error_markers');
});

test('ignores errors above the tail window', () => {
  const head = 'Error: in line 1\n';
  const r = classify({
    name: 'Bash',
    command: 'npm install',
    result: head + lines(250),
  });
  assert.equal(r.pattern, 'bash_truncate');
});

test('does not flag non-bash tools', () => {
  assert.equal(classify({ name: 'Read', command: '', result: lines(900) }), null);
  assert.equal(classify({ name: 'Grep', command: '', result: lines(900) }), null);
});
