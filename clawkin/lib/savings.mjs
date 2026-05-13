export const PRICING_USD_PER_MTOK = {
  sonnet_input: 3.0,
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
  pricing = PRICING_USD_PER_MTOK,
}) {
  const tokensSaved = Math.max(0, raw_output_tokens - delivered_tokens);
  const grossUsd = (tokensSaved * pricing.sonnet_input) / 1_000_000;
  return {
    tokens_saved: tokensSaved,
    gross_usd: grossUsd,
    net_usd: grossUsd,
    savings_cents: dollarsToCents(grossUsd),
  };
}
