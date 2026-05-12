import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classify } from '../lib/classifier.mjs';

function lines(n, prefix = 'line') {
  return Array.from({ length: n }, (_, i) => `${prefix} ${i}`).join('\n');
}

test('returns null for short bash output', () => {
  const r = classify({ name: 'Bash', result: lines(50) });
  assert.equal(r, null);
});

test('flags bash_truncate for long clean output', () => {
  const r = classify({ name: 'Bash', result: lines(250) });
  assert.equal(r.pattern, 'bash_truncate');
  assert.equal(r.confidence, 'high');
  assert.equal(r.metrics.line_count, 250);
});

test('skips when last 20 lines contain error markers', () => {
  const tail = '\nError: something failed';
  const r = classify({ name: 'Bash', result: lines(250) + tail });
  assert.equal(r.pattern, null);
  assert.equal(r.confidence, 'skip');
});

test('does not flag non-bash tools', () => {
  assert.equal(classify({ name: 'Read', result: lines(900) }), null);
  assert.equal(classify({ name: 'Grep', result: lines(900) }), null);
});

test('ignores errors above the tail window', () => {
  const head = 'Error: in line 1\n';
  const r = classify({ name: 'Bash', result: head + lines(250) });
  assert.equal(r.pattern, 'bash_truncate');
});
