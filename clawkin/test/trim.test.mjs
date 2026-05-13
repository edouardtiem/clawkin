import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trimOutput } from '../lib/trim.mjs';

function lines(n) {
  return Array.from({ length: n }, (_, i) => `line ${i}`).join('\n');
}

test('short input passes through untouched', () => {
  const r = trimOutput(lines(40));
  assert.equal(r.trimmed, false);
  assert.equal(r.removed, 0);
});

test('long input keeps head 30 + marker + tail 30', () => {
  const r = trimOutput(lines(200));
  assert.equal(r.trimmed, true);
  assert.equal(r.removed, 140);
  const out = r.text.split('\n');
  assert.equal(out[0], 'line 0');
  assert.equal(out[29], 'line 29');
  assert.match(out[30], /\[Clawkin: 140 lines truncated\]/);
  assert.equal(out[31], 'line 170');
  assert.equal(out.at(-1), 'line 199');
});

test('custom head/tail sizes', () => {
  const r = trimOutput(lines(100), { head_lines: 5, tail_lines: 5 });
  assert.equal(r.removed, 90);
  assert.equal(r.text.split('\n').length, 11);
});

test('non-string input returns empty result', () => {
  const r = trimOutput(undefined);
  assert.equal(r.text, '');
  assert.equal(r.trimmed, false);
});
