import { Router } from "express";
import { fetchAllUsers } from "../controllers/users.controllers";
//import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", fetchAllUsers);

export default router;
