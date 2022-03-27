import { Router } from "express";
import {
  fetchAllUsers,
  loginUser,
  registerUser,
} from "../controllers/users.controllers";
//import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", fetchAllUsers);
router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;
