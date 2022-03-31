export enum HotelPackages {
  Gold = "Gold",
  Silver = "Silver",
  Diamond = "Diamond",
}

interface HotelAddress {
  country: string;
  state: string;
  zipCode?: string;
  city: string;
  street?: string;
  longitude: number;
  latitude: number;
}

interface UserComment {
  comment: string;
  rating: number;
  user: {
    _id: string;
    email: string;
    fullName: string;
  };
}

interface HotelPackage {
  price: number;
  description: string;
  package: HotelPackages;
}

export interface HotelInput {
  name: string;
  description: string;
  roomsAvailable: number;
  images?: string[];
  hotelAddress: HotelAddress;
  comments?: UserComment[];
  hotelPackages: HotelPackage[];
}
