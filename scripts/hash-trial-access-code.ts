import { createAccessCodeHash } from '../apps/web/lib/trial-access-code.ts';

const accessCode = process.argv.slice(2).find((argument) => argument !== '--');
if (!accessCode) {
  throw new Error('Usage: corepack pnpm access-code:hash -- <access-code>');
}

process.stdout.write(`${await createAccessCodeHash(accessCode)}\n`);
