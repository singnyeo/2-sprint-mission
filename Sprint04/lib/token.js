import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../constants.js';

const ACCESS_TOKEN_EXPIRES_IN = '1h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

function generateTokens(userId) {
  const accessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
}

function verifyAccessToken(token) {
  const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
  return { userId: decoded.id };
}

function verifyRefreshToken(token) {
  const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
  return { userId: decoded.id };
}

export { generateTokens, verifyAccessToken, verifyRefreshToken };