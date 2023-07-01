import { randomBytes } from 'crypto';
import { decode, sign, verify } from 'jsonwebtoken';

import { redisClient, connect } from 'redisClient';

export const issueAccessToken = async (login: string) =>
  sign({ login }, String(process.env.ACCESS_TOKEN_SECRET), { expiresIn: '15m' });

export const issueRefreshToken = async (login: string) => {
  await connect();
  const secret = randomBytes(32).toString('hex');
  console.debug(secret)
  await redisClient.set(login, secret);
  return sign({ login }, secret, { expiresIn: '30d' });
};

export const issueTokens = async (login: string) => {
  const [accessToken, refreshToken] = await Promise.all([issueAccessToken(login), issueRefreshToken(login)]);

  return { accessToken, refreshToken };
};

export const verifyAccessToken = async (token: string) => verify(token, String(process.env.ACCESS_TOKEN_SECRET));

export const validateRefreshToken = async (token: string) => {
  const paylaod = decode(token);
  if (!paylaod || typeof paylaod !== 'object' || typeof paylaod.login !== 'string') {
    // throw new JsonWebTokenError('Invalid refresh token');
    return false;
  }
  await connect();
  const secret = await redisClient.get(paylaod.login);
  if (!secret) {
    return false;
  }
  return verify(token, secret);
};

export const invalidateRefreshToken = async (login: string) => {
  await connect();
  await redisClient.del(login);
};
