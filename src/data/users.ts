import { hashSync } from "bcryptjs";
import dotenv from "dotenv";
import { UserDocument, UserInput } from "../types/user.model.types";

// read the environment variables
dotenv.config();

const masterPassword1 = process.env.Master_Password1!;

const users: Array<UserInput | UserDocument> = [
  {
    fullName: "Isaac Ogunleye",
    email: "Isaac.Ogunleye@gmail.com",
    password: hashSync(masterPassword1),
    isAdmin: true,
    pets: [{ name: "Bob" }, { name: "Pussy", pet: "Cat" }],
    address: {
      country: "Mauritius",
      state: "Black River",
      city: "Flic-en-Flac",
    },
  },
  {
    fullName: "Cynthia Iloekwe",
    email: "CynIloekwe@gmail.com",
    password: hashSync("masterPassword2"),
    address: {
      country: "Nigeria",
      state: "Lagos",
      city: "Badagry",
    },
  },
  {
    fullName: "Joy Ajiboye",
    email: "JoyAjiboye@gmail.com",
    password: hashSync("123456789"),
    pets: [{ name: "Tracie", age: 1, dislikes: "Chocolate foods" }],
  },
  {
    fullName: "David Jackson",
    email: "DavidJackson@gmail.com",
    password: hashSync("123456789"),
  },
];

export default users;
