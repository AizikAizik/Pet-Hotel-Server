import {
  DocumentType,
  getModelForClass,
  pre,
  prop,
  Ref,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import bcrypt from "bcryptjs";

enum PetTypes {
  DOG = "Dog",
  CAT = "Cat",
}

class Pets {
  @prop({ enum: PetTypes, default: PetTypes.DOG })
  public pet?: PetTypes;

  @prop({ required: true })
  public name!: string;

  @prop()
  public breed?: string;

  @prop()
  public image?: string;

  @prop()
  public age?: number;

  @prop({ maxLength: 100 })
  public likes?: string;

  @prop({ maxLength: 100 })
  public dislike?: string;
}

class UserAddress {
  @prop({ required: true })
  public country!: string;

  @prop({ required: true })
  public state!: string;

  // @prop({ required: true, min: -90, max: 90 })
  // public latitude!: number;

  // @prop({ required: true, min: -180, max: 180 })
  // public longitude!: number;

  @prop({ required: true })
  public city!: string;

  @prop()
  public street?: string;

  @prop()
  public zipCode?: string;
}

@pre<User>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  // generate salt rounds for hashing the passwords
  const salt = await bcrypt.genSalt(10);
  // set the password to the newly hashed password
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
})
class User extends TimeStamps {
  @prop({ required: true, minLength: 3 })
  public fullName!: string;

  @prop({
    required: true,
    lowercase: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  })
  public email!: string;

  @prop({ required: true, trim: true })
  public password!: string;

  @prop({ required: true, default: false })
  public isAdmin?: boolean;

  @prop({ _id: false })
  public address?: UserAddress; // This is a single SubDocument

  @prop({ type: () => Pets })
  public pets?: Ref<Pets>[];

  public async matchPasswords(
    this: DocumentType<User>,
    enteredPassword: string
  ): Promise<boolean> {
    console.log(enteredPassword);
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

const userModel = getModelForClass(User);

export default userModel;
