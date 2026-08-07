import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the repository .env once. Environment variables supplied by the shell
// or an orchestrator take precedence because dotenv does not override them.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const SECRET_MIN_LENGTH = 32;

export const VARIABLE_DESCRIPTORS = Object.freeze([
  { name: 'PG_HOST', required: true },
  { name: 'PG_PORT', required: true },
  { name: 'PG_DATABASE', required: true },
  { name: 'PG_USER', required: true },
  { name: 'PG_PASSWORD', required: true, secret: true },
  { name: 'JWT_SECRET', required: true, secret: true },
  { name: 'CRYPTO_SECRET', required: true, secret: true },
  { name: 'HMAC_SECRET', required: true, secret: true },
  { name: 'SESSION_SECRET', required: true, secret: true },
  { name: 'PORT', required: true },
  { name: 'NODE_ENV', required: false },
  { name: 'FRONTEND_URL', required: false },
  { name: 'BERTSENT_ENDPOINT', required: false },
  { name: 'BERTOPIC_ENDPOINT', required: false },
  { name: 'BERTRCLS_ENDPOINT', required: false },
  { name: 'PG_MUNICIPALITIES', required: false },
  { name: 'PG_LOCALIZATION', required: false },
]);

export const REQUIRED_VARS = Object.freeze(
  VARIABLE_DESCRIPTORS.filter(({ required }) => required).map(({ name }) => name),
);

export const OPTIONAL_VARS = Object.freeze(
  VARIABLE_DESCRIPTORS.filter(({ required }) => !required).map(({ name }) => name),
);

// These values were committed in docker-compose.yml, .env.development,
// .env.example, or related repository configuration/history.
export const CRYPTO_SECRETS = Object.freeze([
  'JWT_SECRET',
  'SESSION_SECRET',
  'CRYPTO_SECRET',
  'HMAC_SECRET',
]);

// These values were committed in docker-compose.yml, .env.development,
// .env.example, or related repository configuration/history.
export const KNOWN_PUBLIC_SECRETS = Object.freeze(new Set([
  'docker_dev_secret_change_in_production',
  'dev_session_secret_key',
  'your_super_secret_session_key_change_this_in_production',
  'dev_password',
  'survey_password',
]));

const secretDescriptors = VARIABLE_DESCRIPTORS.filter(({ secret }) => secret);

const resolveSecretValues = (source) => {
  const values = { ...source };
  const errors = [];

  for (const { name } of secretDescriptors) {
    const fileName = `${name}_FILE`;
    const directValue = source[name];
    const filePath = source[fileName];

    if (directValue !== undefined && filePath !== undefined) {
      errors.push(`${name} and ${fileName} cannot both be set`);
      continue;
    }

    if (filePath) {
      try {
        values[name] = fs.readFileSync(filePath, 'utf8').trim();
      } catch {
        errors.push(`${fileName} could not be read at configured path: ${filePath}`);
      }
    } else {
      values[name] = directValue;
    }
  }

  return { values, errors };
};

export const buildConfig = (source = process.env) => {
  const { values, errors } = resolveSecretValues(source);
  const warnings = [];

  const missingVars = REQUIRED_VARS.filter((name) => !values[name]);
  if (missingVars.length > 0) {
    errors.push(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  for (const { name } of secretDescriptors) {
    const value = values[name];
    if (!value) continue;

    if (KNOWN_PUBLIC_SECRETS.has(value)) {
      errors.push(`${name} uses a publicly known secret value and must be replaced`);
    }

    if (value.length < SECRET_MIN_LENGTH) {
      const message = `${name} must be at least ${SECRET_MIN_LENGTH} characters long`;
      if (name === 'PG_PASSWORD' || values.NODE_ENV !== 'production') {
        warnings.push(`Warning: ${message}`);
      } else {
        errors.push(message);
      }
    }
  }

  const groupedSecrets = new Map();
  for (const name of CRYPTO_SECRETS) {
    const value = values[name];
    if (!value) continue;
    const names = groupedSecrets.get(value) || [];
    names.push(name);
    groupedSecrets.set(value, names);
  }
  const duplicateGroups = [...groupedSecrets.values()].filter((names) => names.length > 1);
  if (duplicateGroups.length > 0) {
    errors.push(`Cryptographic secrets must be distinct: ${duplicateGroups.map((names) => names.join(', ')).join('; ')}`);
  }

  const config = Object.fromEntries(
    VARIABLE_DESCRIPTORS.map(({ name }) => [name, values[name]]),
  );

  return {
    config: Object.freeze(config),
    errors,
    warnings,
  };
};

const validation = buildConfig(process.env);
validation.warnings.forEach((warning) => console.warn(warning));

if (validation.errors.length > 0) {
  console.error(`Invalid environment configuration:\n- ${validation.errors.join('\n- ')}`);
  process.exit(1);
}

export const env = validation.config;

export const redactedConfig = () => Object.freeze(
  Object.fromEntries(
    VARIABLE_DESCRIPTORS.map(({ name, secret }) => [
      name,
      secret ? '[REDACTED]' : env[name],
    ]),
  ),
);
