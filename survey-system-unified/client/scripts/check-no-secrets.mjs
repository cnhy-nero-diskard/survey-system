import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const clientDirectory = path.resolve(path.dirname(__filename), '..');
const secretNamePattern = /SECRET|TOKEN|PASSWORD|PRIVATE|CREDENTIAL|API_KEY/i;

const envFileNames = fs.readdirSync(clientDirectory)
  .filter((name) => name === '.env' || name.startsWith('.env.'));

const namesFromFiles = envFileNames.flatMap((fileName) => {
  const filePath = path.join(clientDirectory, fileName);
  return fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/)?.[1])
    .filter(Boolean);
});

const offendingNames = [...new Set([
  ...Object.keys(process.env),
  ...namesFromFiles,
])]
  .filter((name) => name.startsWith('REACT_APP_') && secretNamePattern.test(name))
  .sort();

if (offendingNames.length > 0) {
  console.error(
    `Client build blocked: secret-like REACT_APP_* variable names found: ${offendingNames.join(', ')}`,
  );
  process.exit(1);
}

console.log('Client environment secret-name check passed.');
