import { Connection } from "mongoose";

declare module NodeJS {
  interface Global {
    mongoose: Connection;
  }
}
