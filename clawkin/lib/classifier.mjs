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

  if (toolCall?.name === 'Bash' && typeof toolCall.result === 'string') {
    const lineCount = toolCall.result.split('\n').length;
    if (lineCount > cfg.bash_threshold_lines) {
      const hasError = hasErrorInLastLines(
        toolCall.result,
        cfg.bash_error_window,
        cfg.bash_error_markers,
      );
      if (!hasError) {
        return {
          pattern: 'bash_truncate',
          confidence: 'high',
          metrics: { line_count: lineCount },
        };
      }
      return {
        pattern: null,
        confidence: 'skip',
        reason: 'bash_output_contains_error_markers',
        metrics: { line_count: lineCount },
      };
    }
  }

  return null;
}
