import { FastifyError } from 'fastify';

export class MissingKeyError extends Error {
  public statusCode = 500;
  constructor() {
    super('ENCRYPTION_KEY is not set');
    this.name = 'MissingKeyError';
  }
}

export function getEncryptionKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex) {
    throw new MissingKeyError();
  }
  const key = Buffer.from(hex, 'hex');
  if (key.length !== 32) {
    throw new Error(
      `Invalid ENCRYPTION_KEY length: expected 64 hex chars, got ${hex.length}`
    );
  }
  return key;
}