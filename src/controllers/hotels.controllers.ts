import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Hotel from "../models/hotel.model";
import { HotelInput } from "../types/hotel.model.types";

// GET /api/hotel
// description: get all the list of available pet hotels.
// public route
export const getAllHotels = asyncHandler(
  async (req: Request, res: Response) => {
    const hotels = await Hotel.find({});
    res.json(hotels);
  }
);

// POST /api/hotel
// description: add a new hotel with available details to the database
// private route. Only logged in admin users can add a new hotel.
export const addNewHotel = asyncHandler(async (req: Request, res: Response) => {
  if (req.user && req.user.isAdmin) {
    const {
      name,
      description,
      roomsAvailable,
      images,
      hotelPackages,
      address,
    } = req.body as HotelInput;

    const newHotel = await Hotel.create({
      name,
      description,
      roomsAvailable,
      images,
      address,
      hotelPackages,
    });

    if (newHotel) {
      res.status(201);
      res.json(newHotel);
    } else {
      res.status(400);
      throw new Error("Error occured trying to add a new hotel");
    }
  } else {
    res.status(403);
    throw new Error("You are not authorized to add a new hotel");
  }
});
