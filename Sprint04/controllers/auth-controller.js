import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export async function register(req, res) {
  const { email, nickname, password, image } = req.body;

  if (!email || !nickname || !password || !image) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { nickname }],
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: '이미 존재하는 이메일 또는 닉네임입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        image,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('회원가입 에러:', error);
    res.status(500).json({ message: '서버 에러. 잠시 후 다시 시도해주세요.' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('로그인 에러:', error);
    res.status(500).json({ message: '서버 에러. 잠시 후 다시 시도해주세요.' });
  }
}