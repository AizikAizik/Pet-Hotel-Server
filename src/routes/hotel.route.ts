import { Router } from "express";
import { getAllHotels } from "../controllers/hotels.controllers";

const router = Router();

router.get("/", getAllHotels);

export default router;
