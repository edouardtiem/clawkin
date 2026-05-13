import { isSafeCommand } from './safe-commands.mjs';

const DEFAULTS = {
  bash_threshold_lines: 200,
  bash_error_window: 20,
  bash_error_markers: ['error', 'fail', 'exception', 'traceback'],
};

function hasErrorInLastLines(text, n, markers) {
  const tail = text.split('\n').slice(-n).join('\n').toLowerCase();
  return markers.some(m => tail.includes(m));
}

export function classify(toolCall, options = {}) {
  const cfg = { ...DEFAULTS, ...options };

  if (toolCall?.name !== 'Bash' || typeof toolCall.result !== 'string') {
    return null;
  }

  const lineCount = toolCall.result.split('\n').length;
  if (lineCount <= cfg.bash_threshold_lines) return null;

  if (!isSafeCommand(toolCall.command)) {
    return {
      pattern: null,
      confidence: 'skip',
      reason: 'command_not_in_safe_allowlist',
      metrics: { line_count: lineCount },
    };
  }

  if (hasErrorInLastLines(toolCall.result, cfg.bash_error_window, cfg.bash_error_markers)) {
    return {
      pattern: null,
      confidence: 'skip',
      reason: 'bash_output_contains_error_markers',
      metrics: { line_count: lineCount },
    };
  }

  return {
    pattern: 'bash_truncate',
    confidence: 'high',
    metrics: { line_count: lineCount },
  };
}
