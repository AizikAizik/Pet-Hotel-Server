import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

// what is the type for error parameter middleware in node js with typescript
function globalError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Get the node environment (production | development)
  const devENV = process.env.NODE_ENV;
  const status_code = res.statusCode === 200 ? 500 : res.statusCode;
  // send error code back
  res.status(status_code);
  res.json({
    message: err.message,
    stack: devENV === "production" ? null : err.stack,
  });
}

export default globalError;
