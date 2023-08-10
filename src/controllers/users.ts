import { Request, Response } from "express";
import { CreateUser, EmailToken, TokenUser } from "../types/user";
import userRepository from "../repositories/users";
import {
  generateToken,
  hashPassword,
  verifyEmailToken,
  verifyPassword,
} from "../helpers/auth";
import mailService from "../services/mail";
class UsersController {
  async signin(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      // Find the user by email
      const user = await userRepository.findByEmail(email);
      if (!user) {
        res
          .status(401)
          .send({ success: false, message: "Invalid email or password" });
        return;
      }
      if (!user.is_verified) {
        res
          .status(401)
          .send({ success: false, message: "Please verify your email" });
        return;
      }
      // Check if the password is correct
      const passwordMatch = await verifyPassword(password, user.password);
      if (!passwordMatch) {
        res
          .status(401)
          .send({ success: false, message: "Invalid email or password" });
        return;
      }
      user.password = undefined as unknown as string;
      // Generate a token
      const payload: TokenUser = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
      };
      const token = generateToken(payload);
      res.status(200).send({ success: true, data: { ...user, token } });
    } catch (error) {
      res.status(500).send({ success: false, message: error });
    }
  }

  async signup(req: Request, res: Response): Promise<void> {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      res.status(400).send({
        success: false,
        message: "Please provide all required fields",
      });
      return;
    }
    try {
      // Check if the user already exists
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        res.status(409).send({
          success: false,
          message: existingUser.is_verified
            ? "User already exists"
            : "Your account already exist but not verified, Please verify your account",
        });
        return;
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);
      const newUser: CreateUser = {
        full_name: fullName,
        email,
        password: hashedPassword,
      };

      // Send verification email with JWT token
      const payload: EmailToken = {
        full_name: newUser.full_name,
        email: newUser.email,
      };
      await mailService.sendVerificationEmail(payload);
      // Create a new user
      await userRepository.create(newUser);

      res.status(201).send({
        success: true,
        message:
          "A verification email has been sent to your email address. Please verify it.",
      });
    } catch (error) {
      res.status(500).send({ success: false, message: error });
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<void | string> {
    try {
      const token: string = req.params.token;
      const decodedToken = verifyEmailToken(token);
      const user = await userRepository.findOne({
        full_name: decodedToken.user.full_name,
        email: decodedToken.user.email,
        is_verified: false,
      });

      if (!user) {
        res.status(400).send("Something went wrong");
        return;
      }

      if (user) {
        await userRepository.updateOne(
          { id: user.id, email: user.email },
          { is_verified: true },
        );
      }
      res.send("Your email has been verified, kindly log in");
    } catch (error: any) {
      res.status(500).send({ success: false, message: error.message });
    }
  }
}
export default new UsersController();
