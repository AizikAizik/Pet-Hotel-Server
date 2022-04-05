import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.model2";

// GET /api/pets
// description: fetch details about the logged in users pet
// private Route for logged in users
export const getUsersPets = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.user) {
      const user = await User.findById(req.user.id);

      if (user) {
        res.status(200).send(user.pets);
      } else {
        res.status(400);
        throw new Error("Bad Request, Wrong User ID!");
      }
    } else {
      res.status(401);
      throw new Error("You can't access this resource");
    }
  }
);
