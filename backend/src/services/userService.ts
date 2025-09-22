import { prisma } from '../db/prismaClient';
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
export class UserService {
  async getUserProfile(userId: string): Promise<UserProfile> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  async updateUserProfile(userId: string, data: { name?: string }): Promise<UserProfile> {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
    return user;
  }
}
