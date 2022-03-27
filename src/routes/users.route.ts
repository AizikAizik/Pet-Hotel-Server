import { Router } from "express";
import { fetchAllUsers, loginUser } from "../controllers/users.controllers";
//import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", fetchAllUsers);
router.post("/login", loginUser);

export default router;
