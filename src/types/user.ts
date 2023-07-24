import { Request } from "express";
export type User = {
  id: number;
  full_name: string;
  email: string;
  password: string;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
};
export type CreateUser = {
  full_name: string;
  email: string;
  password: string;
};
export type TokenUser = {
  id: number;
  full_name: string;
  email: string;
};
export type EmailToken = {
  full_name: string;
  email: string;
};
export interface RequestWithUser extends Request {
  user?: TokenUser;
}
