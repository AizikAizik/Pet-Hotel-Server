import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import Booking from "../models/booking.model";
import Hotel from "../models/hotel.model";
import { isValidMongooseID } from "../utils/dataUtils";

// POST /api/bookings
// description: booking a new accommodation for pets
// private Route for logged in users
export const createPetBooking = AsyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;

    const {
      hotel,
      pet,
      hotelPackage,
      bookingMethod,
      checkInDate,
      checkOutDate,
    } = req.body;

    // validate pets
    if (!pet) {
      res.status(401);
      throw new Error("No pet added for booking");
    } else if (!isValidMongooseID(pet)) {
      res.status(401);
      throw new Error("Invalid PET ID");
    } else {
      const doesPetExist = user.pets!.find((petData) => {
        //console.log(pet);
        // @ts-ignore
        return petData._id.toString() === pet;
      });

      if (!doesPetExist) {
        res.status(404);
        throw new Error("Invalid ID, You not have a pet with that ID");
      }
    }

    if (!hotel) {
      res.status(401);
      throw new Error("No hotel ID selected for booking");
    } else if (!isValidMongooseID(hotel)) {
      res.status(401);
      throw new Error("Invalid HOTEL ID");
    } else {
      const hotels = await Hotel.findById(hotel);

      if (!hotels) {
        res.status(404);
        throw new Error("Hotel with that ID does not exist");
      }
    }

    const bookingDetails = {
      hotelPackage,
      bookingMethod,
      checkInDate,
      checkOutDate,
    };

    const booking = new Booking({
      user: req.user!.id,
      pet,
      hotel,
      bookingDetails,
    });

    const createdBooking = await booking.save();

    res.status(201).json(createdBooking);
  }
);
