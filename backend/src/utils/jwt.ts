import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  id: string;
  email: string;
}

export const generateToken = (payload: JwtPayload): string => {
  const options: any = {
    expiresIn: JWT_EXPIRES_IN
  };
  return jwt.sign(payload, JWT_SECRET, options);
};
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
