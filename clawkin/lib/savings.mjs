export const PRICING_USD_PER_MTOK = {
  sonnet_input: 3.0,
  haiku_input: 0.25,
  haiku_output: 1.25,
};

export function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

function dollarsToCents(usd) {
  return Math.round(usd * 100);
}

export function computeSavings({
  raw_output_tokens,
  delivered_tokens,
  haiku_input_tokens,
  haiku_output_tokens,
  pricing = PRICING_USD_PER_MTOK,
}) {
  const tokensSaved = Math.max(0, raw_output_tokens - delivered_tokens);
  const grossUsd = (tokensSaved * pricing.sonnet_input) / 1_000_000;
  const haikuCostUsd =
    (haiku_input_tokens * pricing.haiku_input) / 1_000_000 +
    (haiku_output_tokens * pricing.haiku_output) / 1_000_000;
  const netUsd = grossUsd - haikuCostUsd;
  return {
    tokens_saved: tokensSaved,
    gross_usd: grossUsd,
    haiku_cost_usd: haikuCostUsd,
    net_usd: netUsd,
    savings_cents: dollarsToCents(netUsd),
  };
}
