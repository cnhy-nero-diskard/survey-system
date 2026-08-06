import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const validSecrets = {
  PG_PASSWORD: 'p'.repeat(32),
  JWT_SECRET: 'j'.repeat(32),
  SESSION_SECRET: 's'.repeat(32),
  CRYPTO_SECRET: 'c'.repeat(32),
  HMAC_SECRET: 'h'.repeat(32),
};

Object.assign(process.env, {
  PG_HOST: 'localhost',
  PG_PORT: '5432',
  PG_DATABASE: 'survey_test',
  PG_USER: 'survey_user',
  PORT: '5000',
  NODE_ENV: 'test',
  ...validSecrets,
});

const { buildConfig, env, redactedConfig } = await import('../../config/env.js');

const baseSource = {
  PG_HOST: 'localhost',
  PG_PORT: '5432',
  PG_DATABASE: 'survey_test',
  PG_USER: 'survey_user',
  PORT: '5000',
  NODE_ENV: 'test',
  ...validSecrets,
};

describe('environment secret validation', () => {
  it('rejects ambiguous direct and file-based secret configuration', () => {
    const result = buildConfig({
      ...baseSource,
      JWT_SECRET_FILE: 'jwt.secret',
    });

    expect(result.errors).toContain('JWT_SECRET and JWT_SECRET_FILE cannot both be set');
  });

  it('rejects an unreadable secret file without echoing a secret value', () => {
    const result = buildConfig({
      ...baseSource,
      JWT_SECRET: undefined,
      JWT_SECRET_FILE: 'missing/jwt.secret',
    });

    expect(result.errors.join('\n')).toContain('JWT_SECRET_FILE could not be read at configured path');
    expect(result.errors.join('\n')).not.toContain(validSecrets.JWT_SECRET);
  });

  it('rejects deny-listed values in development', () => {
    const result = buildConfig({
      ...baseSource,
      NODE_ENV: 'development',
      PG_PASSWORD: 'dev_password',
    });

    expect(result.errors).toContain(
      'PG_PASSWORD uses a publicly known secret value and must be replaced',
    );
  });

  it('rejects short secrets in production', () => {
    const result = buildConfig({
      ...baseSource,
      NODE_ENV: 'production',
      SESSION_SECRET: 'short-secret',
    });

    expect(result.errors).toContain('SESSION_SECRET must be at least 32 characters long');
  });

  it('warns about short secrets in development without rejecting them', () => {
    const result = buildConfig({
      ...baseSource,
      NODE_ENV: 'development',
      SESSION_SECRET: 'short-secret',
    });

    expect(result.errors).toEqual([]);
    expect(result.warnings).toContain(
      'Warning: SESSION_SECRET must be at least 32 characters long',
    );
  });

  it('reports all duplicated cryptographic secret names in one error', () => {
    const result = buildConfig({
      ...baseSource,
      JWT_SECRET: 'd'.repeat(32),
      HMAC_SECRET: 'd'.repeat(32),
    });

    expect(result.errors).toContain(
      'Cryptographic secrets must be distinct: JWT_SECRET, HMAC_SECRET',
    );
  });

  it('trims a trailing newline from a file-based secret', () => {
    const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'survey-env-'));
    const secretPath = path.join(temporaryDirectory, 'jwt.secret');
    fs.writeFileSync(secretPath, `${validSecrets.JWT_SECRET}\n`);

    const result = buildConfig({
      ...baseSource,
      JWT_SECRET: undefined,
      JWT_SECRET_FILE: secretPath,
    });

    expect(result.errors).toEqual([]);
    expect(result.config.JWT_SECRET).toBe(validSecrets.JWT_SECRET);
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  });

  it('redacts every secret-classified value', () => {
    const redacted = redactedConfig();

    for (const name of Object.keys(validSecrets)) {
      expect(redacted[name]).toBe('[REDACTED]');
      expect(JSON.stringify(redacted)).not.toContain(env[name]);
    }
  });

  it('accepts distinct secrets of at least 32 characters', () => {
    const result = buildConfig(baseSource);

    expect(result.errors).toEqual([]);
  });

  it('aggregates missing required variables without exposing values', () => {
    const result = buildConfig({ NODE_ENV: 'production' });
    const message = result.errors.join('\n');

    expect(message).toContain('Missing required environment variables');
    expect(message).toContain('PG_HOST');
    expect(message).toContain('JWT_SECRET');
    expect(message).toContain('SESSION_SECRET');
    expect(message).not.toContain('public');
  });
});
