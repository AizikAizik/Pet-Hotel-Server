import express, { Request, Response } from "express";
import morgan from "morgan";

const app = express();

// use middlewares here
// middleware to log route
app.use(morgan("dev"));

// middleware to pass json body data
app.use(express.json());

const PORT = process.env.PORT || 5000;

// home route
app.get("/", (_: Request, res: Response) => {
  res.send({
    message: "Welcome to the Pet Hotel JSON API server",
  });
});

app.listen(PORT, () => {
  console.log(`server is up and running on port ${PORT}`);
});
