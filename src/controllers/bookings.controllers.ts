import { Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import Booking from "../models/booking.model";
import Hotel from "../models/hotel.model";
import { getPetWithID, isValidMongooseID } from "../utils/dataUtils";
import _ from "underscore";

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

// GET /api/bookings
// description: view all available bookings made by a user
// private Route for logged in users
export const getMyBookings = AsyncHandler(
  async (req: Request, res: Response) => {
    const mybookings = await Booking.find({ user: req.user!.id }).populate({
      path: "hotel",
      select: "_id name address",
    });

    res.status(200).send(mybookings);
  }
);

// GET /api/bookings/:bookingID
// description: view details about a particular booking
// private Route for logged in users to see more info about a specific booking
export const getSingleBooking = AsyncHandler(
  async (req: Request, res: Response) => {
    const singleBooking = await Booking.findById(req.params.bookingID)
      .populate({
        path: "hotel",
        select: "_id name description address ratings",
      })
      .populate({ path: "user", select: "fullName email address" });

    if (singleBooking) {
      if (req.user!._id.toString() === singleBooking.id || req.user!.isAdmin) {
        const petDetails = await getPetWithID(
          req.user,
          singleBooking.pet!.toString()
        );
        //const response = _.extendOwn(singleBooking, petDetails);
        res.status(200).send({ singleBooking, petDetails });
      } else {
        res.status(401);
        throw new Error(
          "Only Admins can view orders that doesn't belong to them"
        );
      }
    } else {
      res.status(404);
      throw new Error("Booking not found");
    }
  }
);

// GET /api/bookings/getall
// description: view all available bookings made by all users
// private Route for admin users to view all available bookings
export const getAllBookings = AsyncHandler(
  async (req: Request, res: Response) => {
    if (req.user!.isAdmin) {
      const allBookings = await Booking.find({})
        .populate({ path: "user", select: "-password" })
        .populate({
          path: "hotel",
          select: "_id name description address ratings",
        });
      res.status(200).send(allBookings);
    } else {
      res.status(403);
      throw new Error("You are Forbidden!!. Only admins can view all bookings");
    }
  }
);

// DELETE /api/bookings/:bookingID
// description: cancel a particular booking.
// bookings can only be cancelled if the paymentStatus is "not paid"
// private route for logged in users and admins
export const cancelBooking = AsyncHandler(
  async (req: Request, res: Response) => {
    const singleBooking = await Booking.findById(req.params.bookingID);

    if (singleBooking) {
      if (
        (req.user!._id.toString() === singleBooking.user!.toString() ||
          req.user!.isAdmin) &&
        !singleBooking.isPaid!
      ) {
        await singleBooking.deleteOne({
          _id: singleBooking._id,
        });
        res.status(200).send({ message: "Booking cancelled Successfully!" });
      } else {
        res.status(403);
        throw new Error("You cannot delete this booking");
      }
    } else {
      res.status(404);
      throw new Error("Booking not found");
    }
  }
);

// PUT /api/bookings/:bookingID/pay
// description: update a user booking to be paid for.
// private route for logged in users
export const payForBookings = AsyncHandler(
  async (req: Request, res: Response) => {
    const booking = await Booking.findById(req.params.bookingID);

    if (booking) {
      booking.isPaid = true;
      booking.paidAt = new Date();
      booking.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.updateTime,
        emailAddress: req.body.payer.email_address,
      };

      const hotel = await Hotel.findById(booking.pet);
      await hotel?.decreaseNumberOfRooms();

      const updatedBooking = await booking.save();
      res.status(200).json(updatedBooking);
    } else {
      res.status(404);
      throw new Error("Booking not found");
    }
  }
);
