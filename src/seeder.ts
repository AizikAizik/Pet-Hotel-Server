import dotenv from "dotenv";
import connectDB from "./config/db";
import users from "./data/users";
import User from "./models/user.model2";

//load env variables
dotenv.config();

// connect to the database
connectDB();

// import dummy data to Database
const importData = async () => {
  try {
    // delete all the data in Users and Diary Collection
    // await Diary.deleteMany();
    await User.deleteMany();

    // insert data to users collection
    await User.insertMany(users);
    console.log("Data added successfully!");
    process.exit(0);
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    //await Diary.deleteMany();
    await User.deleteMany();

    console.log("Data deleted successfully!");
    process.exit(0);
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};

// run the script
// npm install typescript
// node seeder.js -d || node seeder.js
if (process.argv[2] === "-d") {
  deleteData();
} else {
  importData();
}