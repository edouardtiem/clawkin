#!/usr/bin/env node
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { routeBashPostTool, OUTCOMES } from '../lib/router.mjs';
import { readState } from '../lib/state.mjs';

function makeFakeBashOutput(lines) {
  const out = [];
  out.push('+ npm install');
  for (let i = 0; i < lines; i++) {
    out.push(`npm http fetch GET 200 https://registry.npmjs.org/pkg-${i} 12ms (cache hit)`);
  }
  out.push('added 1247 packages in 8s');
  return out.join('\n');
}

async function main() {
  const sandbox = await mkdtemp(join(tmpdir(), 'clawkin-sim-'));
  process.env.CLAWKIN_HOME = sandbox;

  const lines = Number(process.argv[2] ?? 350);
  const command = process.argv[3] ?? 'npm install';
  const bashOutput = makeFakeBashOutput(lines);

  const event = {
    tool_name: 'Bash',
    tool_input: { command },
    tool_response: { stdout: bashOutput, stderr: '' },
  };

  const result = await routeBashPostTool({
    tool_input: event.tool_input,
    tool_response: event.tool_response,
  });

  console.log('--- Clawkin simulate (deterministic V1) ---');
  console.log('sandbox:', sandbox);
  console.log('command:', command);
  console.log('outcome:', result.outcome);
  if (result.outcome === OUTCOMES.INTERCEPTED) {
    console.log('decision:', result.decision);
    console.log('dispatch:', result.dispatch);
    const ls = result.summary.split('\n');
    console.log('summary preview:');
    console.log([...ls.slice(0, 5), '   ...', ls[30], '   ...', ...ls.slice(-5)].join('\n'));
    console.log('savings:', result.savings);
  } else {
    console.log('skip reason:', result.decision?.reason);
  }

  const state = await readState();
  console.log('state.lifetime_savings_cents:', state.lifetime_savings_cents);
  console.log('state.current_month_savings_cents:', state.current_month_savings_cents);
  console.log('state.dispatches.length:', state.dispatches.length);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
