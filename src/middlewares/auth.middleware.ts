import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model2";
import dotenv from "dotenv";
import { UserDocument } from "../types/user.model.types";

dotenv.config();

export interface TokenInterface {
  id: string;
  iat: number;
  exp: number;
}

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string = "";
    // private secret key to decode token
    let secret = process.env.JWT_SECRETKEY!;

    // if request has an Authorization and starts with Bearer
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        // get the token value from the string
        token = req.headers.authorization.split(" ")[1];

        // decode the token
        let decodeToken = jwt.verify(token, secret) as
          | TokenInterface
          | JwtPayload;

        // append the user object to the request headers
        req.user = (await User.findById(decodeToken.id).select(
          "-password"
        )) as unknown as UserDocument | undefined;

        //console.log(req.user);
        // go to the next middleware or controller
        next();
      } catch (e: any) {
        console.error(e.message);
        res.status(401);
        throw new Error("Not Authorized, token failed");
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("Not Authorized, token is required");
    }
  }
);

export { protect };
