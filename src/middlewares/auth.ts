import { Request, Response, NextFunction } from "express";
import { getBearerToken, verifyToken } from "../helpers/auth";
import { RequestWithUser, TokenUser } from "../types/user";
import { JwtPayload } from "jsonwebtoken";

export interface JwtPayloadWithUser extends JwtPayload {
  user: TokenUser;
}

export function authenticate(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void {
  const token = getBearerToken(req);

  if (!token) {
    res.status(401).send({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    let decodedToken: JwtPayloadWithUser;
    decodedToken = verifyToken(token) as JwtPayloadWithUser;
    req.user = decodedToken.user;
    next();
  } catch (error) {
    res.status(401).send({ success: false, message: "Invalid token" });
  }
}
