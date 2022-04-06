import { Router } from "express";
import {
  createNewPet,
  deleteUsersPet,
  getUsersPets,
} from "../controllers/pets.controllers";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", protect, getUsersPets);
router.post("/", protect, createNewPet);
router.delete("/:petID", protect, deleteUsersPet);

export default router;
