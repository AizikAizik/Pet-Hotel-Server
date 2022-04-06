import { Ref } from "@typegoose/typegoose";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { cloudinary } from "../config/cloudinary";
import User from "../models/user.model2";
import { Pets } from "../types/user.model.types";
import { uploadSingleImageFile } from "../utils/uploadImages";

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

// POST /api/pets
// description: Creates pet for a user
// private Route for logged in users
export const createNewPet = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, breed, pet, image, age, likes, dislikes } = req.body;

    const user = await User.findById(req.user?.id);

    const newPet: any = {};

    if (user) {
      if (breed) newPet.breed = breed;
      if (pet) newPet.pet = pet;
      if (image) {
        const uploadedResponse = await uploadSingleImageFile(image);
        newPet.image = uploadedResponse.secure_url;
      }
      if (age) newPet.age = age;
      if (likes) newPet.likes = likes;
      if (dislikes) newPet.dislikes = dislikes;

      newPet.name = name;
      console.log(newPet);
      user.pets?.push(newPet);
      const updatedPet = await user.save();

      res.json(updatedPet.pets);
    }
  }
);
