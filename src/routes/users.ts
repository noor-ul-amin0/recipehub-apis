import { Router } from "express";
import { signup, signin } from "../controllers/users";

const router = Router();

// User signup route
router.post("/signup", signup);

// User signin route
router.post("/signin", signin);

export default router;
