import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Hotel from "../models/hotel.model";

// GET /api/hotel
// description: get all the list of available pet hotels.
// public route
export const getAllHotels = asyncHandler(
  async (req: Request, res: Response) => {
    const hotels = await Hotel.find({});
    res.json(hotels);
  }
);
