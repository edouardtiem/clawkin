export const DEFAULTS = {
  head_lines: 30,
  tail_lines: 30,
};

export function trimOutput(text, options = {}) {
  const cfg = { ...DEFAULTS, ...options };
  if (typeof text !== 'string') {
    return { text: '', trimmed: false, kept: 0, removed: 0 };
  }
  const lines = text.split('\n');
  if (lines.length <= cfg.head_lines + cfg.tail_lines) {
    return { text, trimmed: false, kept: lines.length, removed: 0 };
  }
  const head = lines.slice(0, cfg.head_lines);
  const tail = lines.slice(-cfg.tail_lines);
  const removed = lines.length - cfg.head_lines - cfg.tail_lines;
  const out = [
    ...head,
    `[Clawkin: ${removed} lines truncated]`,
    ...tail,
  ].join('\n');
  return {
    text: out,
    trimmed: true,
    kept: cfg.head_lines + cfg.tail_lines + 1,
    removed,
  };
}
