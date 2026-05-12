import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeSavings, estimateTokens, PRICING_USD_PER_MTOK } from '../lib/savings.mjs';

test('estimateTokens uses 4 chars per token heuristic', () => {
  assert.equal(estimateTokens(''), 0);
  assert.equal(estimateTokens('abcd'), 1);
  assert.equal(estimateTokens('abcde'), 2);
});

test('computeSavings produces positive net for large interception', () => {
  const s = computeSavings({
    raw_output_tokens: 5000,
    delivered_tokens: 100,
    haiku_input_tokens: 5200,
    haiku_output_tokens: 100,
  });
  assert.equal(s.tokens_saved, 4900);
  assert.ok(s.gross_usd > s.haiku_cost_usd, 'gross > haiku cost expected');
  assert.ok(s.net_usd > 0);
  assert.equal(s.savings_cents, Math.round(s.net_usd * 100));
});

test('computeSavings can be negative if Haiku cost dwarfs gross', () => {
  const s = computeSavings({
    raw_output_tokens: 100,
    delivered_tokens: 80,
    haiku_input_tokens: 100_000,
    haiku_output_tokens: 1000,
  });
  assert.ok(s.net_usd < 0);
});

test('pricing constants match spec section 7.1', () => {
  assert.equal(PRICING_USD_PER_MTOK.sonnet_input, 3.0);
  assert.equal(PRICING_USD_PER_MTOK.haiku_input, 0.25);
  assert.equal(PRICING_USD_PER_MTOK.haiku_output, 1.25);
});
