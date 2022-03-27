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

// POST /api/users/register
// description: Register a new user
// public Route
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body;

    // check to see if email already exists
    const userExist = await User.findOne({ email });

    // if email exists,the throw an Error
    if (userExist) {
      res.status(400);
      throw new Error(`${email} already exists ☹☹`);
    }

    const user = await User.create({
      fullName,
      email,
      password,
    });

    if (user) {
      res.status(201);
      res.send({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user.id),
      });
    } else {
      res.status(400);
      throw new Error("could not create user");
    }
  }
);
