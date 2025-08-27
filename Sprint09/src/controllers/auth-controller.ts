import { Request, Response } from 'express';
import { AuthService } from '../service/auth-service';

const authService = new AuthService();

export async function register(req: Request, res: Response) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('회원가입 에러:', error);
    res.status(error.status || 500).json({ message: error.message || '서버 에러' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { message, tokens } = await authService.login(req.body);

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    res.status(200).json({ message });
  } catch (error: any) {
    console.error('로그인 에러:', error);
    res.status(error.status || 500).json({ message: error.message || '서버 에러' });
  }
}

export async function refreshTokens(req: Request, res: Response) {
  try {
    const { accessToken, refreshToken } = await authService.refreshTokens(req.body.refreshToken);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    res.status(200).json({ message: '토큰 갱신 성공' });
  } catch (error: any) {
    console.error('토큰 갱신 에러:', error);
    res.status(error.status || 500).json({ message: error.message || '서버 에러' });
  }
}

export async function logout(_: Request, res: Response) {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.status(200).json({ message: '로그아웃 성공' });
}