import { randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';

import { redisClient, connect } from '@/redisClient';

export const issueAccessToken = async (sub: string) =>
  sign({ sub }, String(process.env.ACCESS_TOKEN_SECRET), { expiresIn: '15m' });

export const issueRefreshToken = async (sub: string) => {
  await connect();
  const secret = randomBytes(32).toString('hex');
  await redisClient.set(sub, secret);
  return sign({ sub }, secret, { expiresIn: '30d' });
};

export const issueTokens = async (sub: string) => {
  const [accessToken, refreshToken] = await Promise.all([issueAccessToken(sub), issueRefreshToken(sub)]);

  return { accessToken, refreshToken };
};

export const invalidateRefreshToken = async (sub: string) => {
  await connect();
  await redisClient.del(sub);
};
