import { Router } from "express";
import {
  createPetBooking,
  getAllBookings,
  getMyBookings,
  getSingleBooking,
  cancelBooking,
} from "../controllers/bookings.controllers";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, createPetBooking);
router.get("/", protect, getMyBookings);
router.get("/getall", protect, getAllBookings);
router.get("/:bookingID", protect, getSingleBooking);
router.delete("/:bookingID", protect, cancelBooking);

export default router;
