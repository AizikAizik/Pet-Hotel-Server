import { Request, Response, NextFunction } from "express";

function notFoundError(req: Request, res: Response, next: NextFunction) {
  const error = new Error(`Not Found - ${req.originalUrl}`);

  // send 404 error back to the client
  res.status(404);

  next(error);
}

export default notFoundError;
