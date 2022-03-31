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
    const users = await User.find({}).select("-password");
    console.log(req.user);
    if (req.user && req.user.isAdmin) {
      res.json(users);
    } else {
      res.status(401);
      throw new Error(`Only Admin can access this resource`);
    }
  }
);

// GET /api/users/profile
// description: return users profile data
// private Route for logged in users only
export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.user?.id)
      .select("-password")
      .select("-__v");

    if (user) res.send(user);
    else {
      res.status(404);
      throw new Error("User not found!");
    }
  }
);

// PUT /api/users/profile
// description: update users profile data
// private Route for logged in users only
export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.user?.id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.email = req.body.email || user.email;
      user.address = req.body.address || user.address;

      const updatedUser = await user.save();

      res.json({
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        pets: updatedUser.pets,
        address: updatedUser.address,
        token: generateToken(updatedUser.id),
      });
    } else {
      res.status(404);
      throw new Error("User not found!");
    }
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

    //const hashedPassword = await bcrypt.hash(password, 10);
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
