// import * as express from "express";
import { TokenUser } from "../user";

declare module "express-serve-static-core" {
  interface Request {
    user?: TokenUser;
  }
}
