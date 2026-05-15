import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../config/database';
import env from '../../config/env';

export const loginAdmin = async (username: string, password: string) => {
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) return null;

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return null;

  const token = jwt.sign({ id: admin.id, username: admin.username }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });

  return {
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      createdAt: admin.createdAt,
    },
  };
};

export const getAdminById = async (id: string) => {
  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) return null;

  return {
    id: admin.id,
    username: admin.username,
    createdAt: admin.createdAt,
  };
};

export const changePassword = async (id: string, oldPass: string, newPass: string) => {
  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) return false;

  const isMatch = await bcrypt.compare(oldPass, admin.password);
  if (!isMatch) return false;

  const hashed = await bcrypt.hash(newPass, 10);
  await prisma.admin.update({
    where: { id },
    data: { password: hashed },
  });

  return true;
};
