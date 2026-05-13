import { classify } from './classifier.mjs';
import { trimOutput } from './trim.mjs';
import { computeSavings, estimateTokens } from './savings.mjs';
import { recordDispatch, updateState } from './state.mjs';

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
  now = () => new Date(),
  persist = true,
  trimOptions,
}) {
  const command = tool_input?.command ?? '';
  const output = extractBashOutput(tool_response);

  const decision = classify({ name: 'Bash', command, result: output });
  if (!decision || decision.pattern !== 'bash_truncate') {
    return { outcome: OUTCOMES.SKIPPED, decision };
  }

  const lines = output.split('\n');
  const trim = trimOutput(output, trimOptions);

  const raw_output_tokens = estimateTokens(output);
  const delivered_tokens = estimateTokens(trim.text);
  const savings = computeSavings({ raw_output_tokens, delivered_tokens });

  const dispatch = {
    ts: now().toISOString(),
    pattern: 'bash_truncate',
    command: command.slice(0, 200),
    line_count: lines.length,
    lines_removed: trim.removed,
    tokens_intercepted: raw_output_tokens,
    tokens_delivered: delivered_tokens,
    savings_cents: savings.savings_cents,
  };

  if (persist) {
    await updateState(state => recordDispatch(state, dispatch));
  }

  return {
    outcome: OUTCOMES.INTERCEPTED,
    decision,
    dispatch,
    summary: trim.text,
    savings,
  };
}
