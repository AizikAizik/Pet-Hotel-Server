import { Document } from "mongoose";

type pets = "Dog" | "Cat";

interface UserAddress {
  country: string;
  state: string;
  zipCode?: string;
  city?: string;
  streetName?: string;
  longitude: number;
  latitude: number;
}

interface Pets {
  pet?: pets;
  breed?: string;
  name: string;
}

export interface UserInput {
  email: string;
  fullName: string;
  password: string;
  isAdmin?: boolean;
}

export interface UserDocument extends UserInput, Document {
  address?: UserAddress;
  pets?: Pets[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
}
