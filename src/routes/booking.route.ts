import { Router } from "express";
import {
  createPetBooking,
  getAllBookings,
  getMyBookings,
  getSingleBooking,
  cancelBooking,
  payForBookings,
} from "../controllers/bookings.controllers";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, createPetBooking);
router.get("/", protect, getMyBookings);
router.get("/getall", protect, getAllBookings);
router.get("/:bookingID", protect, getSingleBooking);
router.delete("/:bookingID", protect, cancelBooking);
router.put("/:bookingID/pay", protect, payForBookings);

export default router;
