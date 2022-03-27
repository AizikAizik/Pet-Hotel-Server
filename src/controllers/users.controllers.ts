//import { generateToken } from "../utils/tokenUtils";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.model2";

// GET /api/users
// description: fetch all users from database
// private Route for admin only
export const fetchAllUsers = asyncHandler(
  async (req: Request, res: Response) => {
    // empty object is used to find all ....
    const users = await User.find({});
    res.send(users);

    //   if (req.user.isAdmin) {
    //     res.json(users);
    //   } else {
    //     res.status(401);
    //     throw new Error(`Only Admin can access this resource`);
    //   }
  }
);
