import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// create sign in token
export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRETKEY!, { expiresIn: "2 days" });
};
