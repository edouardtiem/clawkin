import { classify } from './classifier.mjs';
import { dispatchHaiku } from './haiku-dispatch.mjs';
import { computeSavings, estimateTokens } from './savings.mjs';
import { recordDispatch, updateState } from './state.mjs';
import { loadApiKey } from './key.mjs';

export const OUTCOMES = {
  SKIPPED: 'skipped',
  INTERCEPTED: 'intercepted',
  ERROR: 'error',
};

function extractBashOutput(toolResponse) {
  if (!toolResponse) return '';
  if (typeof toolResponse === 'string') return toolResponse;
  const { stdout = '', stderr = '' } = toolResponse;
  return [stdout, stderr].filter(Boolean).join('\n');
}

export async function routeBashPostTool({
  tool_input,
  tool_response,
  apiKey,
  dispatcher = dispatchHaiku,
  now = () => new Date(),
  persist = true,
}) {
  const command = tool_input?.command ?? '';
  const output = extractBashOutput(tool_response);

  const decision = classify({ name: 'Bash', result: output });
  if (!decision || decision.pattern !== 'bash_truncate') {
    return { outcome: OUTCOMES.SKIPPED, decision };
  }

  const lines = output.split('\n');
  const key = apiKey ?? (await loadApiKey());
  if (!key) {
    return {
      outcome: OUTCOMES.SKIPPED,
      decision,
      reason: 'no_api_key',
    };
  }

  let result;
  try {
    result = await dispatcher({
      pattern: 'bash_truncate',
      vars: { command, n_lines: lines.length, output },
      apiKey: key,
    });
  } catch (err) {
    return {
      outcome: OUTCOMES.ERROR,
      decision,
      error: err.message ?? String(err),
    };
  }

  const raw_output_tokens = estimateTokens(output);
  const delivered_tokens = estimateTokens(result.text);
  const savings = computeSavings({
    raw_output_tokens,
    delivered_tokens,
    haiku_input_tokens: result.usage.input_tokens,
    haiku_output_tokens: result.usage.output_tokens,
  });

  const dispatch = {
    ts: now().toISOString(),
    pattern: 'bash_truncate',
    command: command.slice(0, 200),
    line_count: lines.length,
    tokens_intercepted: raw_output_tokens,
    tokens_delivered: delivered_tokens,
    tokens_haiku_input: result.usage.input_tokens,
    tokens_haiku_output: result.usage.output_tokens,
    haiku_latency_ms: result.latency_ms,
    savings_cents: savings.savings_cents,
  };

  if (persist) {
    await updateState(state => recordDispatch(state, dispatch));
  }

  return {
    outcome: OUTCOMES.INTERCEPTED,
    decision,
    dispatch,
    summary: result.text,
    savings,
  };
}
