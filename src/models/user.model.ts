import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { UserDocument } from "../types/user.model.types";

const petSchema = new Schema(
  {
    pet: {
      type: String,
      enum: ["Dog", "Cat"],
      default: "Dog",
      required: true,
    },
    breed: { type: String },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

// create user schema
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      min: [3, "name too short"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      min: [6, "email too short"],
    },
    password: {
      type: String,
      required: true,
      select: false,
      min: [6, "password too short"],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    pets: [petSchema],
    address: {
      country: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },
      zipCode: { type: String },
      city: { type: String },
      streetName: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

//userSchema.index({email: 1});

userSchema.pre("save", async function (this: UserDocument, next: Function) {
  if (!this.isModified("password")) return next();

  // generate salt rounds for hashing
  const salt = await bcrypt.genSalt(10);
  // set the password to the newly hashed password
  this.password = await bcrypt.hash(this.password, salt);

  return next();
});

userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  const user = this as UserDocument;
  // check if plain text matches hashed password
  return await bcrypt.compare(enteredPassword, user.password);
};

export default mongoose.model<UserDocument>("User", userSchema);
