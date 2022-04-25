import express, { Request, Response } from "express";
import morgan from "morgan";
import connectDB from "./config/db";
import notFoundError from "./errors/404";
import globalError from "./errors/error";
import cors from "cors";
import helmet from "helmet";

// import routes here
import usersRoute from "./routes/users.route";
import hotelRoute from "./routes/hotel.route";
import petRoute from "./routes/pet.route";
import bookingRoute from "./routes/booking.route";

const app = express();

// use middlewares here
// middleware to log route
app.use(morgan("dev"));

// middleware to pass json body data
app.use(express.json());

app.use(helmet());

const allowedDomains = [
  process.env.CORS_DOMAIN,
  "http://localhost:3000",
  "https://www.sandbox.paypal.com/xoplatform/logger/api/logger",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // bypass the requests with no origin (like curl requests, mobile apps, etc )
      if (!origin) return callback(null, true);

      if (allowedDomains.indexOf(origin) === -1) {
        var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

// use route middleware
app.use("/api/users", usersRoute);
app.use("/api/hotel", hotelRoute);
app.use("/api/pets", petRoute);
app.use("/api/bookings", bookingRoute);

const PORT = process.env.PORT || 5000;

// home route
app.get("/", async (_: Request, res: Response) => {
  res.send({
    message: "Welcome to the Pet Hotel JSON API server",
  });
});

// get Paypal Client ID
app.get("/api/config/paypal", (_, res: Response) =>
  res.send({ paypalId: process.env.PAYPAL_CLIENT_ID })
);

//run error middlewares
app.use(notFoundError);
app.use(globalError);

app.listen(PORT, () => {
  connectDB();
  console.log(`server is up and running on port ${PORT}`);
});
