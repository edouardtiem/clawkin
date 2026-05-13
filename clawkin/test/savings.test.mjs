import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeSavings, estimateTokens, PRICING_USD_PER_MTOK } from '../lib/savings.mjs';

test('estimateTokens uses 4 chars per token heuristic', () => {
  assert.equal(estimateTokens(''), 0);
  assert.equal(estimateTokens('abcd'), 1);
  assert.equal(estimateTokens('abcde'), 2);
});

test('computeSavings is gross (no Haiku cost) and positive on interception', () => {
  const s = computeSavings({ raw_output_tokens: 5000, delivered_tokens: 100 });
  assert.equal(s.tokens_saved, 4900);
  assert.ok(s.gross_usd > 0);
  assert.equal(s.net_usd, s.gross_usd);
  assert.equal(s.savings_cents, Math.round(s.gross_usd * 100));
});

test('computeSavings returns 0 tokens_saved when delivered >= raw', () => {
  const s = computeSavings({ raw_output_tokens: 100, delivered_tokens: 100 });
  assert.equal(s.tokens_saved, 0);
  assert.equal(s.gross_usd, 0);
  assert.equal(s.savings_cents, 0);
});

test('pricing constant matches Sonnet input price', () => {
  assert.equal(PRICING_USD_PER_MTOK.sonnet_input, 3.0);
});
