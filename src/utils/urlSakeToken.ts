import crypto from 'crypto';

export const generateUrlSafeToken = () => {
    return crypto.randomBytes(48).toString('base64url');
}