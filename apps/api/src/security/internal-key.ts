import { timingSafeEqual } from 'node:crypto';

export function isInternalAppKeyValid(provided: string | undefined, expected: string | undefined): boolean {
  if (!provided || !expected) return false;

  const actualBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}
