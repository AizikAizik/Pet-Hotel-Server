import mongoose from "mongoose";
import dotenv from "dotenv";

// reads the env variables
dotenv.config();

// connect to the database
const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGODB_URI!);

    console.log(`MongoDB connected: ${con.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
