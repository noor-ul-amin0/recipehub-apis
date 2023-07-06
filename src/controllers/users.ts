import { Request, Response } from "express";
import { CreateUser, TokenUser } from "../types/user";
import userRepository from "../repositories/users";
import { generateToken, hashPassword, verifyPassword } from "../helpers/auth";

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
        res
          .status(409)
          .send({ success: false, message: "User already exists" });
        return;
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);
      const newUser: CreateUser = {
        full_name: fullName,
        email,
        password: hashedPassword,
      };
      debugger;
      // Create a new user
      await userRepository.create(newUser);

      res
        .status(201)
        .send({ success: true, message: "User registered successfully" });
    } catch (error) {
      res.status(500).send({ success: false, message: error });
    }
  }
}
export default new UsersController();
