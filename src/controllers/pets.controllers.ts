import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.model2";
import {
  deleteSinglePet,
  doesPetWithIDExist,
  isValidMongooseID,
} from "../utils/dataUtils";
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
      await user.save();

      res.json(newPet);
    }
  }
);

// DELETE /api/pets/:petID
// description: delete pet details of user based on the pet ID passed as parameter
// private route for logged in users
export const deleteUsersPet = asyncHandler(
  async (req: Request, res: Response) => {
    const petID = req.params.petID;
    const isValid = isValidMongooseID(petID);

    if (!isValid) {
      res.status(401);
      throw new Error("Invalid ID. Pet with that ID does not exist");
    }

    const user = await User.findById(req.user?.id);

    const doesPetExist = await doesPetWithIDExist(user, petID);

    if (!doesPetExist) {
      res.status(404);
      throw new Error("You do not have a pet with that ID!");
    }

    if (user) {
      const pets = await deleteSinglePet(user, petID);
      user.pets = pets;
      await user.save();

      res.status(200).json({ message: "Pet Deleted Successfully" });
    } else {
      res.status(401);
      throw new Error("You do not own this pet");
    }
  }
);
