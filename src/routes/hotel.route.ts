import { Router } from "express";
import {
  addNewHotel,
  getAllHotels,
  postCommentToHotel,
  getSingleBooking,
} from "../controllers/hotels.controllers";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllHotels);
router.post("/", protect, addNewHotel);
router.get("/:hotelID", getSingleBooking);
router.post("/:hotelID/comment", protect, postCommentToHotel);

export default router;
