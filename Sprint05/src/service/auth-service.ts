import bcrypt from 'bcrypt';
import { AuthRepository } from '../repository/auth-repository';
import { generateTokens, verifyRefreshToken } from '../lib/token';

export class AuthService {
  constructor(private authRepo = new AuthRepository()) {}

  async register({ email, nickname, password, image }: any) {
    if (!email || !nickname || !password || !image) {
      throw { status: 400, message: '모든 필드를 입력해주세요.' };
    }

    const existingUser = await this.authRepo.findUserByEmailOrNickname(email, nickname);
    if (existingUser) {
      throw { status: 409, message: '이미 존재하는 이메일 또는 닉네임입니다.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.authRepo.createUser({ email, nickname, password: hashedPassword, image });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login({ email, password }: any) {
    if (!email || !password) {
      throw { status: 400, message: '이메일과 비밀번호를 입력해주세요.' };
    }

    const user = await this.authRepo.findUserByEmail(email);
    if (!user || !user.password) {
      throw { status: 401, message: '이메일 또는 비밀번호가 잘못되었습니다.' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { status: 401, message: '이메일 또는 비밀번호가 잘못되었습니다.' };
    }

    const tokens = generateTokens(user.id);
    return { message: '로그인 성공', tokens };
  }

  async refreshTokens(refreshToken: string) {
    if (!refreshToken) {
      throw { status: 400, message: 'Refresh Token이 필요합니다.' };
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      throw { status: 401, message: '유효하지 않은 Refresh Token입니다.' };
    }

    const user = await this.authRepo.findUserById(payload.userId);
    if (!user) {
      throw { status: 401, message: '사용자를 찾을 수 없습니다.' };
    }

    return generateTokens(user.id);
  }
}