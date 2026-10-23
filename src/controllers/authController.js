import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

const sign = (user) =>
  jwt.sign({}, process.env.JWT_SECRET, { subject: user.id, expiresIn: '7d' });

const publicUser = { id: true, email: true, name: true };

export const registration = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!password) {
      res.status(400).json({ message: 'You must provide password' });
    }
    if (password.length <= 8) {
      res.status(400).json({ message: 'Password must be more than 8 symbols' });
    }
    if (!email || !name) {
      return res.status(400).json({
        message: 'You must provide email, name',
      });
    }
    if (await prisma.user.findUnique({ where: { email } })) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    const user = await prisma.user.create({
      data: { email, name, password: await bcrypt.hash(password, 10) },
      select: publicUser,
    });
    res.status(201).json({ user, token: sign(user) });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email ||
      !password
    ) {
      return res
        .status(400)
        .json({ message: 'You must provide email and password' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: 'You must provide valid email' });
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    const isPasswordValid = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token: sign(user),
    });
  } catch (err) {
    next(err);
  }
};

export const protectedToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      res.json({ message: 'Protected data', user: decoded });
    });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};
