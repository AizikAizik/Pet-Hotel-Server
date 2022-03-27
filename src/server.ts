import express, { Request, Response } from "express";
import morgan from "morgan";
import connectDB from "./config/db";
import notFoundError from "./errors/404";
import globalError from "./errors/error";
import usersRoute from "./routes/users.route";

const app = express();

// use middlewares here
// middleware to log route
app.use(morgan("dev"));

// middleware to pass json body data
app.use(express.json());

// use route middleware
app.use("/api/users", usersRoute);

const PORT = process.env.PORT || 5000;

// home route
app.get("/", async (_: Request, res: Response) => {
  res.send({
    message: "Welcome to the Pet Hotel JSON API server",
  });
});

//run error middlewares
app.use(notFoundError);
app.use(globalError);

app.listen(PORT, () => {
  connectDB();
  console.log(`server is up and running on port ${PORT}`);
});
