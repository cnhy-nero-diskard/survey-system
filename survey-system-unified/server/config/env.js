import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const REQUIRED_VARS = Object.freeze([
  'PG_HOST',
  'PG_PORT',
  'PG_DATABASE',
  'PG_USER',
  'PG_PASSWORD',
  'JWT_SECRET',
  'CRYPTO_SECRET',
  'HMAC_SECRET',
  'SESSION_SECRET',
  'PORT',
]);

export const OPTIONAL_VARS = Object.freeze([
  'NODE_ENV',
  'FRONTEND_URL',
  'BERTSENT_ENDPOINT',
  'BERTOPIC_ENDPOINT',
  'BERTRCLS_ENDPOINT',
  'PG_MUNICIPALITIES',
  'PG_LOCALIZATION',
]);

const missingVars = REQUIRED_VARS.filter((name) => !process.env[name]);
if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

export const env = Object.freeze(
  Object.fromEntries([...REQUIRED_VARS, ...OPTIONAL_VARS].map((name) => [name, process.env[name]])),
);
