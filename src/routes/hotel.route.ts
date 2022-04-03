import { Router } from "express";
import { addNewHotel, getAllHotels } from "../controllers/hotels.controllers";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllHotels);
router.post("/", protect, addNewHotel);

export default router;
