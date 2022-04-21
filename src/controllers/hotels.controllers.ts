import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Hotel from "../models/hotel.model";
import Booking from "../models/booking.model";
import { HotelInput } from "../types/hotel.model.types";
import { isValidMongooseID } from "../utils/dataUtils";

// GET /api/hotel
// description: get all the list of available pet hotels.
// public route
export const getAllHotels = asyncHandler(
  async (req: Request, res: Response) => {
    const hotels = await Hotel.find({});
    res.json(hotels);
  }
);

// GET /api/hotel/:hotelID
// description: get single hotel from the database
// public route
export const getSingleBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const { hotelID } = req.params;

    if (!isValidMongooseID(hotelID)) {
      res.status(500);
      throw new Error("hotelID is an invalid mongoDB id");
    }
    const hotel = await Hotel.findById(hotelID);

    if (hotel) {
      res.status(200).json(hotel);
    } else {
      res.status(401);
      throw new Error("Hotel with that ID not found");
    }
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

// POST /api/hotel/:hotelID/comment
// description: routes for users to add a comment to a hotel
// users can only add comments only when they've successfully booked with the hotel in the past
// private route. Only logged in admin users can add a new hotel.
export const postCommentToHotel = asyncHandler(
  async (req: Request, res: Response) => {
    const { comment, rating } = req.body;

    // see if the hotel ID is a valid mongoose ID
    if (!isValidMongooseID(req.params.hotelID)) {
      res.status(500);
      throw new Error("Invalid Hotel ID");
    }

    // check if the hotel ID exists
    const hotel = await Hotel.findById(req.params.hotelID);

    // if hotel ID does not exist, then throw not found error
    if (!hotel) {
      res.status(404);
      throw new Error("Hotel not found with that ID");
    }

    // check if the user has already made a comment once before
    hotel.comments!.forEach((comment) => {
      if (comment.user.id === req.user!.id) {
        res.status(403);
        throw new Error("You can only comment once. Sorry!!");
      }
    });

    // find booking that matches the hotel and the user
    const booking = await Booking.findOne({
      hotel: req.params.hotelID,
      user: req.user?.id,
    });

    // check if user has booked with the hotel once before and has paid
    if (booking && booking.isPaid) {
      hotel.comments?.push({
        comment,
        rating,
        user: {
          id: req.user!.id,
          fullName: req.user!.fullName,
          email: req.user!.email,
        },
      });

      // update the no of reviews and average ratings for the hotel
      await hotel.updateNumOfRewiews();
      await hotel.updateAverageRatings();

      const addNewComment = await await hotel.save();
      res.status(200).json(addNewComment);
    } else {
      res.status(403);
      throw new Error(
        "You can only comment on hotels you've booked and paid for in the past."
      );
    }
  }
);
