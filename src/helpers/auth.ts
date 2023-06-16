import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { hash, compare } from "bcryptjs";
import { TokenUser } from "../types/user";
import { JwtPayloadWithUser } from "../middlewares/auth";

export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}

export const generateToken = (user: TokenUser): string => {
  const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
    expiresIn: "2 days",
  });
  return token;
};

export const verifyToken = (token: string): JwtPayloadWithUser | string => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayloadWithUser;
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7); // Remove "Bearer " from the beginning
    return token;
  }

  return null;
}
