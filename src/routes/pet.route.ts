import { Router } from "express";
import {
  createNewPet,
  deleteUsersPet,
  getUsersPets,
  updateUsersPet,
} from "../controllers/pets.controllers";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", protect, getUsersPets);
router.post("/", protect, createNewPet);
router.put("/:petID", protect, updateUsersPet);
router.delete("/:petID", protect, deleteUsersPet);

export default router;
