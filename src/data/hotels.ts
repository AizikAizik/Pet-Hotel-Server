import { HotelInput, HotelPackages } from "../types/hotel.model.types";
import { IMAGE1, IMAGE2, IMAGE3 } from "../types/images";
import { getRandomLatLng } from "../utils/randomGeo";

const hotels: Array<HotelInput> = [
  {
    name: "Santiago Pet Hotel",
    description:
      "Pet hotel for Cats and Dogs located on the outskirts of Spain 🇪🇸",
    roomsAvailable: 24,
    images: [IMAGE1],
    hotelPackages: [
      {
        package: HotelPackages.Gold,
        price: 15,
        description: "Room comes with Webcam and a courtyard for pets",
      },
      {
        package: HotelPackages.Silver,
        price: 10,
        description: "Room comes with courtyard only for pets",
      },
    ],
    hotelAddress: {
      country: "Spain",
      state: "Valencia",
      city: "Ciutat de les Arts i les Ciències",
      longitude: getRandomLatLng(-180, 180),
      latitude: getRandomLatLng(-90, 90),
    },
    comments: [
      {
        comment:
          "They delivered as promised 😇. I fully recommend this Pet Hotel to anyone still doubting",
        rating: 5,
        user: {
          _id: "624432332317d2837bf4bbf7",
          fullName: "Isaac Ogunleye",
          email: "isaac.ogunleye@gmail.com",
        },
      },
    ],
  },
  {
    name: "York Pet Hotel",
    description:
      "Pet hotel for Cats and Dogs located in Ney York City in the subdivision area",
    roomsAvailable: 15,
    images: [IMAGE2, IMAGE3],
    hotelPackages: [
      {
        package: HotelPackages.Gold,
        price: 25,
        description: "Room comes with Webcam, courtyard, pet toys",
      },
      {
        package: HotelPackages.Silver,
        price: 18,
        description: "Room comes with courtyard and toys for pets only",
      },
    ],
    hotelAddress: {
      country: "United States",
      state: "New York",
      city: "Yonkers",
      longitude: getRandomLatLng(-180, 180),
      latitude: getRandomLatLng(-90, 90),
    },
    comments: [
      {
        comment: "The webcam feature wasn't always available sometimes 😡",
        rating: 2.5,
        user: {
          _id: "624432332317d2837bf4bbf7",
          fullName: "Isaac Ogunleye",
          email: "isaac.ogunleye@gmail.com",
        },
      },
      {
        comment:
          "Watcing my pets play and make new friends with other cats was very nice to see from afar",
        rating: 4,
        user: {
          _id: "624432332317d2837bf4bbfb",
          fullName: "Joy Ajiboye",
          email: "joyajiboye@gmail.com",
        },
      },
    ],
  },
];

export default hotels;
