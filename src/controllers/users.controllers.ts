//import { generateToken } from "../utils/tokenUtils";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.model2";
import { generateToken } from "../utils/token";

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

// POST /api/users/login
// DESC controller for authenticating user login
// public route
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // first check if the email exists
  const user = await User.findOne({ email });

  // check if email exists and matches the password for that particular email
  if (user && (await user.matchPasswords(password))) {
    res.status(200);
    res.json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user.id),
    });
  } else {
    res.status(401);
    throw new Error(`wrong email or password`);
  }
});
