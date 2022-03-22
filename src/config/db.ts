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
// import mongoose, {MongoClient, Db} from "mongoose";

// type MongoConnection = {
//   client: MongoClient;
//   db: Db;
// };

// declare global {
//   namespace NodeJS {
//     interface Global {
//       mongo: {
//         conn: MongoConnection | null;
//         promise: Promise<MongoConnection> | null;
//       };
//     }
//   }
// }

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error(
//     "Please define the MONGODB_URI environment variable inside .env.local"
//   );
// }

// /**
//  * Global is used here to maintain a cached connection across hot reloads
//  * in development. This prevents connections growing exponentially
//  * during API Route usage.
//  */
// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function dbConnect() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       return mongoose;
//     });
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default dbConnect;
