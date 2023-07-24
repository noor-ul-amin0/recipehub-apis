import { Response, NextFunction } from "express";
import { getBearerToken, verifyToken } from "../helpers/auth";
import { EmailToken, RequestWithUser, TokenUser } from "../types/user";
import { JwtPayload } from "jsonwebtoken";
import userRepository from "../repositories/users";

export interface JwtPayloadWithUser extends JwtPayload {
  user: TokenUser;
}
export interface JwtPayloadWithVerifyEmailUser extends JwtPayload {
  user: EmailToken;
}
export async function authenticate(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = getBearerToken(req);

  if (!token) {
    res.status(401).send({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    let decodedToken: JwtPayloadWithUser;
    decodedToken = verifyToken(token) as JwtPayloadWithUser;
    const user = await userRepository.findByEmail(decodedToken.user.email);
    if (!user || user.id !== decodedToken.user.id) {
      res.status(401).send({ success: false, message: "Unauthorized" });
      return;
    }
    req.user = decodedToken.user;
    next();
  } catch (error) {
    res.status(401).send({ success: false, message: "Invalid token" });
  }
}
