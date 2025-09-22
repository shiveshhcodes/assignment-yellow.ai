import { prisma } from '../db/prismaClient';
import { hashPassword, comparePassword } from '../utils/crypto';
import { generateToken } from '../utils/jwt';
import { RegisterData, LoginData } from '../utils/validators';
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}
export class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('Checking for existing user with email:', data.email);
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }
      
      console.log('Hashing password...');
      const passwordHash = await hashPassword(data.password);
      
      console.log('Creating new user...');
      const user = await prisma.user.create({
        data: {
          email: data.email,
          passwordHash,
          name: data.name,
        },
      });
      console.log('User created successfully:', user.id);
      
      console.log('Generating token...');
      const token = generateToken({
        id: user.id,
        email: user.email,
      });
      
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      console.error('Registration service error:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      throw error;
    }
  }
  async login(data: LoginData): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const isValidPassword = await comparePassword(data.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }
    const token = generateToken({
      id: user.id,
      email: user.email,
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }
}
