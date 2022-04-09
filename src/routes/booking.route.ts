import { Router } from "express";
import { createPetBooking } from "../controllers/bookings.controllers";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, createPetBooking);

export default router;
