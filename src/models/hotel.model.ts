import {
  DocumentType,
  getModelForClass,
  pre,
  prop,
  Ref,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { HotelPackages } from "../types/hotel.model.types";
import { User } from "./user.model2";

class HotelAddress {
  @prop({ required: true })
  public country!: string;

  @prop({ required: true })
  public state!: string;

  @prop({ required: true, min: -90, max: 90 })
  public latitude!: number;

  @prop({ required: true, min: -180, max: 180 })
  public longitude!: number;

  @prop({ required: true })
  public city!: string;

  @prop()
  public street?: string;

  @prop()
  public zipCode?: string;
}

class UserComment extends TimeStamps {
  @prop({ required: true })
  public comment!: string;

  @prop({ required: true, min: 1, max: 5 })
  public rating!: number;

  @prop({
    required: true,
  })
  public user!: Ref<User>;
}

class HotelPackage {
  @prop({ required: true, enum: HotelPackages })
  package!: string;

  @prop({ required: true, min: 0 })
  price!: number;

  @prop({ required: true })
  description!: string;
}

@pre<Hotel>("save", async function (next) {
  this.num_of_reviews = this.comments?.length || 0;

  let sum = 0;
  this.comments?.forEach((comment) => {
    let x = comment as UserComment;
    sum += x.rating;
  });

  console.log(sum);
  this.ratings = sum / this.num_of_reviews;
  next();
})
class Hotel extends TimeStamps {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  description!: string;

  @prop({ required: true, min: 0 })
  roomsAvailable!: number;

  @prop({ _id: false })
  public address?: HotelAddress;

  @prop({ type: () => UserComment })
  public comments?: Ref<UserComment>[];

  @prop({ default: 0, min: 0 })
  public num_of_reviews?: number;

  @prop({ type: () => HotelPackage })
  hotelPackages?: Ref<HotelPackage>[];

  // total average ratings for a specific hotel. Calculated field
  @prop({ required: true, default: 0, min: 0 })
  ratings!: number;

  // after successful booking, decrease the number of available rooms
  public async decreaseNumberOfRooms(this: DocumentType<Hotel>) {
    if (this.roomsAvailable < 1) this.roomsAvailable = 0;
    else this.roomsAvailable = this.roomsAvailable--;

    await this.save();
  }
}

const hotelModel = getModelForClass(Hotel);

export default hotelModel;
