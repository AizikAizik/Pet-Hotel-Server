import { ObjectId } from "mongoose";
import { HotelPackages } from "./hotel.model.types";

export enum PaymentGatewayTypes {
  PayPal = "PayPal",
}

export enum BookingProgress {
  InProgress = "InProgress",
  Completed = "Completed",
}

export enum BookingMethod {
  PickUp = "PickUp",
  Home = "Home",
}

export interface BookingInterface {
  user: string | ObjectId;
  hotel: string;
  pet: string;
  bookingDetails: {
    hotelPackage: HotelPackages;
    bookingMethod: BookingMethod;
    checkInDate: Date | string;
    checkOutDate: Date | string;
  };
}
