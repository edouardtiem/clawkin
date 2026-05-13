import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isSafeCommand } from '../lib/safe-commands.mjs';

test('single safe commands', () => {
  assert.equal(isSafeCommand('npm install'), true);
  assert.equal(isSafeCommand('pytest'), true);
  assert.equal(isSafeCommand('make build'), true);
  assert.equal(isSafeCommand('docker build .'), true);
  assert.equal(isSafeCommand('cargo test --release'), true);
});

test('safe command in a chain still matches', () => {
  assert.equal(isSafeCommand('cd src && npm install'), true);
  assert.equal(isSafeCommand('rm -rf node_modules; npm install'), true);
  assert.equal(isSafeCommand('npm ci || npm install'), true);
});

test('unsafe commands return false', () => {
  assert.equal(isSafeCommand('git log --oneline'), false);
  assert.equal(isSafeCommand('grep -r foo .'), false);
  assert.equal(isSafeCommand('find . -name "*.ts"'), false);
  assert.equal(isSafeCommand('cat file.txt'), false);
  assert.equal(isSafeCommand('ls -la'), false);
});

test('empty / null / undefined returns false', () => {
  assert.equal(isSafeCommand(''), false);
  assert.equal(isSafeCommand(null), false);
  assert.equal(isSafeCommand(undefined), false);
});
