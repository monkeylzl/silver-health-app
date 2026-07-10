import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';

const SCRYPT_KEY_LENGTH = 64;
const SCRYPT_COST = 16_384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;

export function isTrialAccessConfigured(configuredHash: string | undefined, nodeEnv: string | undefined) {
  return Boolean(configuredHash) || nodeEnv !== 'production';
}

function scrypt(accessCode: string, salt: Uint8Array) {
  return new Promise<Buffer>((resolve, reject) => {
    scryptCallback(
      accessCode,
      salt,
      SCRYPT_KEY_LENGTH,
      {
        N: SCRYPT_COST,
        r: SCRYPT_BLOCK_SIZE,
        p: SCRYPT_PARALLELIZATION,
      },
      (error, derivedKey) => {
        if (error) reject(error);
        else resolve(derivedKey);
      },
    );
  });
}

export async function createAccessCodeHash(accessCode: string, salt: Uint8Array = randomBytes(16)): Promise<string> {
  if (!accessCode.trim()) throw new Error('access code is required');
  const derivedKey = await scrypt(accessCode, salt);

  return [
    'scrypt',
    SCRYPT_COST,
    SCRYPT_BLOCK_SIZE,
    SCRYPT_PARALLELIZATION,
    Buffer.from(salt).toString('base64url'),
    derivedKey.toString('base64url'),
  ].join('$');
}

export async function verifyAccessCode(accessCode: string, encodedHash: string): Promise<boolean> {
  const [algorithm, cost, blockSize, parallelization, saltValue, hashValue] = encodedHash.split('$');
  if (
    algorithm !== 'scrypt'
    || Number(cost) !== SCRYPT_COST
    || Number(blockSize) !== SCRYPT_BLOCK_SIZE
    || Number(parallelization) !== SCRYPT_PARALLELIZATION
    || !saltValue
    || !hashValue
  ) {
    return false;
  }

  try {
    const expected = Buffer.from(hashValue, 'base64url');
    const actual = await scrypt(accessCode, Buffer.from(saltValue, 'base64url'));
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}
