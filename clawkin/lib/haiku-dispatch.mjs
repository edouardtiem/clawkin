import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { promptsDir } from './paths.mjs';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

export const DEFAULTS = {
  model: 'claude-haiku-4-5-20251001',
  max_tokens: 1024,
  temperature: 0.2,
  timeout_ms: 5000,
};

async function loadTemplate(name) {
  const file = join(promptsDir(), `${name}.prompt.md`);
  return readFile(file, 'utf8');
}

function render(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) =>
    Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : '',
  );
}

function splitTemplate(rendered) {
  const sysIdx = rendered.indexOf('SYSTEM:');
  const userIdx = rendered.indexOf('USER:');
  if (sysIdx < 0 || userIdx < 0 || userIdx < sysIdx) {
    throw new Error('prompt template must contain SYSTEM: then USER:');
  }
  const system = rendered.slice(sysIdx + 'SYSTEM:'.length, userIdx).trim();
  const user = rendered.slice(userIdx + 'USER:'.length).trim();
  return { system, user };
}

export async function buildRequest({ pattern, vars }) {
  const tpl = await loadTemplate(pattern);
  const { system, user } = splitTemplate(render(tpl, vars));
  return { system, user };
}

export async function dispatchHaiku({
  pattern,
  vars,
  apiKey,
  fetchFn = globalThis.fetch,
  options = {},
}) {
  const { system, user } = await buildRequest({ pattern, vars });
  const cfg = { ...DEFAULTS, ...options };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), cfg.timeout_ms);
  const started = Date.now();

  try {
    const res = await fetchFn(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: cfg.model,
        max_tokens: cfg.max_tokens,
        temperature: cfg.temperature,
        system,
        messages: [{ role: 'user', content: user }],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`anthropic_http_${res.status}: ${body.slice(0, 200)}`);
    }

    const json = await res.json();
    const text = (json.content ?? [])
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    return {
      text,
      usage: {
        input_tokens: json.usage?.input_tokens ?? 0,
        output_tokens: json.usage?.output_tokens ?? 0,
      },
      latency_ms: Date.now() - started,
      model: cfg.model,
    };
  } finally {
    clearTimeout(timer);
  }
}

export function createMockDispatcher({ summary, usage } = {}) {
  return async ({ vars }) => {
    const lines = vars.output?.split('\n') ?? [];
    const fallback = lines.length > 6
      ? `[mock] ${lines.length} lines summarized. First: ${lines[0]?.slice(0, 60) ?? ''}. Last: ${lines[lines.length - 1]?.slice(0, 60) ?? ''}.`
      : (vars.output ?? '');
    return {
      text: summary ?? fallback,
      usage: usage ?? { input_tokens: 800, output_tokens: 60 },
      latency_ms: 5,
      model: 'mock-haiku',
    };
  };
}
