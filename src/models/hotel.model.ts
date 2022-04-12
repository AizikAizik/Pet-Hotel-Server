import {
  DocumentType,
  getModelForClass,
  mongoose,
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

class UserCommentDetails {
  @prop({ required: true })
  public id!: string;

  @prop({ required: true })
  public fullName!: string;

  @prop()
  public email?: string;
}

class UserComment extends TimeStamps {
  @prop({ required: true })
  public comment!: string;

  @prop({ required: true, min: 1, max: 5 })
  public rating!: number;

  @prop({
    _id: false,
    required: true,
  })
  public user!: UserCommentDetails;
}

class HotelPackage {
  @prop({ required: true, enum: HotelPackages })
  package!: string;

  @prop({ required: true, min: 0 })
  price!: number;

  @prop({ required: true })
  description!: string;
}

export class Hotel extends TimeStamps {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  description!: string;

  @prop({ type: String, required: true, default: [] })
  images!: mongoose.Types.Array<string>;

  @prop({ required: true, min: 0 })
  roomsAvailable!: number;

  @prop({ _id: false })
  public address?: HotelAddress;

  @prop({ type: () => UserComment, _id: false })
  public comments?: UserComment[];

  @prop({
    min: 0,
    default: function (this: Hotel) {
      console.log({ comment: this.comments?.length });
      return this.comments?.length;
    },
  })
  public num_of_reviews?: number;

  @prop({ type: () => HotelPackage, _id: false })
  public hotelPackages?: Ref<HotelPackage>[];

  // total average ratings for a specific hotel. Calculated field
  @prop({
    min: 0,
    // default: function (this: Hotel) {
    //   this.num_of_reviews = this.comments?.length || 0;

    //   let sum = 0;
    //   this.comments?.forEach((comment) => {
    //     let x = comment as UserComment;
    //     sum += x.rating;
    //   });

    //   console.log({ sum });
    //   this.ratings = sum / this.num_of_reviews;
    //   return this.ratings;
    // },
    default: 0,
  })
  public ratings?: number;

  // after successful booking, decrease the number of available rooms
  public async decreaseNumberOfRooms(this: DocumentType<Hotel>) {
    if (this.roomsAvailable < 1) this.roomsAvailable = 0;
    else this.roomsAvailable = this.roomsAvailable--;

    await this.save();
  }

  // update the number of reviews
  public async updateNumOfRewiews(this: DocumentType<Hotel>) {
    this.num_of_reviews = this.comments?.length || 0;

    await this.save();
  }

  // update the average rating for a particular hotel document
  public async updateAverageRatings(this: DocumentType<Hotel>) {
    this.num_of_reviews = this.comments?.length || 0;

    let sum = 0;
    this.comments?.forEach((comment) => {
      let x = comment as UserComment;
      sum += x.rating;
    });

    this.ratings = sum / this.num_of_reviews;

    await this.save();
  }
}

const hotelModel = getModelForClass(Hotel);

export default hotelModel;
