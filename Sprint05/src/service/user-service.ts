import { UserRepository } from '../repository/user-repository';
import bcrypt from 'bcrypt';

interface UpdateProfileInput {
  nickname?: string;
  image?: string;
  currentPassword?: string;
  newPassword?: string;
}

export class UserService {
  constructor(private userRepo = new UserRepository()) {}

  async getUserProfile(userId: number) {
    const user = await this.userRepo.findUserProfile(userId);
    if (!user) throw new Error('사용자를 찾을 수 없습니다.');
    return user;
  }

  async updateUserProfile(userId: number, input: UpdateProfileInput) {
    const user = await this.userRepo.findUserById(userId);
    if (!user) throw new Error('사용자를 찾을 수 없습니다.');

    if (input.newPassword) {
      if (!input.currentPassword) {
        throw new Error('비밀번호 변경 시 현재 비밀번호를 입력해주세요.');
      }
      const isMatch = await bcrypt.compare(input.currentPassword, user.password);
      if (!isMatch) {
        throw new Error('현재 비밀번호가 올바르지 않습니다.');
      }
    }

    const dataToUpdate: any = {
      nickname: input.nickname,
      image: input.image,
    };

    if (input.newPassword) {
      dataToUpdate.password = await bcrypt.hash(input.newPassword, 10);
    }

    return this.userRepo.updateUserProfile(userId, dataToUpdate);
  }

  async getMyProducts(userId: number) {
    return this.userRepo.findProductsByUserId(userId);
  }
}