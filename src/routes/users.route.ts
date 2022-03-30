import { Router } from "express";
import {
  fetchAllUsers,
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/users.controllers";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", protect, fetchAllUsers);
router.get("/profile", protect, getUserProfile);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.put("/profile", protect, updateUserProfile);

export default router;
