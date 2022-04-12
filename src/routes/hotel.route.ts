import { Router } from "express";
import {
  addNewHotel,
  getAllHotels,
  postCommentToHotel,
} from "../controllers/hotels.controllers";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllHotels);
router.post("/", protect, addNewHotel);
router.post("/:hotelID/comment", protect, postCommentToHotel);

export default router;
