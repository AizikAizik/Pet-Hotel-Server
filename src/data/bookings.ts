import { BookingInterface, BookingMethod } from "../types/booking.model.types";
import { HotelPackages } from "../types/hotel.model.types";
import { convertDateToIsoStringFormat } from "../utils/dateUtils";

const bookings: Array<BookingInterface> = [
  {
    user: "6246bdc40b3353c355991152",
    pet: "624dc3a925506b3f0c78bfb3",
    hotel: "624981ef33deccac365d692d",
    bookingDetails: {
      hotelPackage: HotelPackages.Diamond,
      bookingMethod: BookingMethod.PickUp,
      checkInDate: convertDateToIsoStringFormat(new Date()),
      checkOutDate: convertDateToIsoStringFormat(new Date("2022-04-13")),
    },
  },
];

export default bookings;
