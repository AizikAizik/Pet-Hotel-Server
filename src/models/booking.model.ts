import {
  DocumentType,
  getModelForClass,
  mongoose,
  pre,
  prop,
  Ref,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import moment from "moment";
import {
  BookingMethod,
  BookingProgress,
  PaymentGatewayTypes,
} from "../types/booking.model.types";
import { HotelPackages } from "../types/hotel.model.types";
import {
  validateCheckInDate,
  convertDateToIsoStringFormat,
  getCurrentFormatedDate,
  getDifferenceInDays,
  validateCheckOutDate,
} from "../utils/dateUtils";
import { Hotel } from "./hotel.model";
import { Pets, User } from "./user.model2";

class BookingDetails {
  @prop({ required: true, enum: HotelPackages })
  public hotelPackage!: String;

  @prop({ required: true, enum: BookingMethod })
  public bookingMethod!: string;

  @prop({
    required: true,
    type: Date,
    //min: getCurrentFormatedDate(),
    validate: {
      validator: function (v: any) {
        //const obj = this as BookingDetails;
        return validateCheckInDate(v, new Date());
      },
      message: "Check in date cannot be before the currentDate!",
    },
  })
  public checkInDate!: Date;

  @prop({
    required: true,
    type: Date,
    validate: {
      validator: function (v: any) {
        const obj = this as BookingDetails;
        return validateCheckOutDate(v, obj.checkInDate);
      },
      message: "Check out date cannot be before check in date!",
    },
  })
  public checkOutDate!: Date;

  @prop({
    min: 1,
    default: function (this: BookingDetails) {
      if (this.hotelPackage === "Diamond") return (this.price_per_night = 25);

      if (this.hotelPackage === "Gold") return (this.price_per_night = 20);

      return (this.price_per_night = 15);
    },
  })
  public price_per_night?: number;

  @prop({
    min: 1,
    default: function (this: BookingDetails) {
      const startDate = moment(this.checkInDate).format("YYYY-MM-DD");
      const endDate = moment(this.checkOutDate).format("YYYY-MM-DD");

      return (this.no_of_booking_days = getDifferenceInDays(
        startDate,
        endDate
      ));
    },
  })
  public no_of_booking_days?: number;
}

class PaymentResult {
  @prop({ type: String })
  public id!: string;

  @prop({ type: String })
  public status!: string;

  @prop({ type: String })
  public update_time!: string;

  @prop({ type: String })
  public emailAddress!: string;
}

// @pre<Booking>("save", function (next) {
//   if (!this.isModified("bookingDetails")) {
//     next();
//   }

//   if (this.bookingDetails.bookingMethod === BookingMethod.PickUp) {
//     this.deliveryCharge = 5;
//   }

//   this.totalPrice =
//     this.bookingDetails.no_of_booking_days! *
//       this.bookingDetails.price_per_night! +
//     this.deliveryCharge!;

//   console.log(this.totalPrice);
// })
class Booking extends TimeStamps {
  @prop({ required: true, ref: () => User })
  public user!: Ref<User>;

  @prop({ required: true, ref: () => Hotel })
  public hotel!: Ref<Hotel>;

  @prop({ required: true, ref: () => Pets })
  public pet!: Ref<Pets>;

  @prop({ enum: PaymentGatewayTypes, default: PaymentGatewayTypes.PayPal })
  public paymentMethod?: String;

  @prop({ enum: BookingProgress, default: BookingProgress.InProgress })
  public bookingStaus?: String;

  @prop({ _id: false })
  public bookingDetails!: BookingDetails;

  @prop({ default: false, type: Boolean })
  isPaid?: boolean;

  @prop({ type: Date })
  paidAt?: Date;

  @prop({ _id: false })
  public paymentResult?: PaymentResult;

  @prop({
    type: Number,
    min: 0,
    default: function (this: Booking) {
      if (this.bookingDetails.bookingMethod === BookingMethod.PickUp) {
        return (this.deliveryCharge = 5);
      } else return 0;
    },
  })
  public deliveryCharge?: number;

  @prop({
    type: Number,
    min: 1,
    default: function (this: Booking) {
      return (this.totalPrice =
        this.bookingDetails.no_of_booking_days! *
          this.bookingDetails.price_per_night! +
        this.deliveryCharge!);
    },
  })
  public totalPrice?: number;
}

const bookingModel = getModelForClass(Booking);

export default bookingModel;
