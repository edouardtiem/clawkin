#!/usr/bin/env node
import { routeBashPostTool, OUTCOMES } from '../lib/router.mjs';

async function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

function emit(payload) {
  process.stdout.write(JSON.stringify(payload));
}

async function main() {
  const raw = await readStdin();
  let event;
  try {
    event = raw.trim() ? JSON.parse(raw) : {};
  } catch {
    process.exit(0);
  }

  if (event.tool_name !== 'Bash') process.exit(0);

  try {
    const result = await routeBashPostTool({
      tool_input: event.tool_input,
      tool_response: event.tool_response,
    });

    if (result.outcome === OUTCOMES.INTERCEPTED) {
      const savedCents = result.dispatch.savings_cents;
      const context = [
        `[Clawkin] Bash output trimmed (head 30 + tail 30).`,
        `Original: ${result.dispatch.line_count} lines. Dropped: ${result.dispatch.lines_removed} lines.`,
        `Trimmed output:`,
        result.summary,
        savedCents > 0 ? `[Clawkin saved ~$${(savedCents / 100).toFixed(2)} on this call]` : '',
      ].filter(Boolean).join('\n');

      emit({
        continue: true,
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: context,
        },
      });
    }
    process.exit(0);
  } catch (err) {
    process.stderr.write(`[clawkin] hook error: ${err?.message ?? err}\n`);
    process.exit(0);
  }
}

main();
