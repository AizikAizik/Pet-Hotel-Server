import { UserDocument } from "../../src/types/user.model.types";
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
