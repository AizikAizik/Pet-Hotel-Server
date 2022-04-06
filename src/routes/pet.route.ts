import { Router } from "express";
import { createNewPet, getUsersPets } from "../controllers/pets.controllers";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", protect, getUsersPets);
router.post("/", protect, createNewPet);

export default router;
