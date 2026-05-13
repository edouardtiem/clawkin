export const SAFE_COMMANDS = new Set([
  'npm', 'yarn', 'pnpm', 'npx',
  'pip', 'pip3', 'poetry', 'pipenv',
  'cargo',
  'gem', 'bundle',
  'composer',
  'go',
  'make', 'cmake', 'gradle', 'gradlew', 'mvn', 'bazel', 'ninja',
  'webpack', 'vite', 'rollup', 'esbuild', 'tsc', 'parcel', 'next',
  'pytest', 'jest', 'vitest', 'mocha', 'rspec', 'phpunit', 'tox',
  'docker', 'podman',
  'apt', 'apt-get', 'brew', 'yum', 'dnf', 'pacman',
]);

export function isSafeCommand(cmd) {
  if (!cmd || typeof cmd !== 'string') return false;
  const tokens = cmd.split(/[\s&|;]+/).filter(Boolean);
  return tokens.some(t => SAFE_COMMANDS.has(t));
}
