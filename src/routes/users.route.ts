import { Router } from "express";
import {
  fetchAllUsers,
  loginUser,
  registerUser,
  userProfile,
} from "../controllers/users.controllers";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", protect, fetchAllUsers);
router.get("/profile", protect, userProfile);
router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;
