import { Router } from "express";
import { getUsersPets } from "../controllers/pets.controllers";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", protect, getUsersPets);

export default router;
