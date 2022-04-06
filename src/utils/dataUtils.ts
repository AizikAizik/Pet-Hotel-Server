import mongoose from "mongoose";

export async function doesPetWithIDExist(user: any, id: string) {
  const data = user.pets?.find((pet: any) => {
    // @ts-ignore
    return pet.id === id;
  });

  return data ? true : false;
}

export async function deleteSinglePet(user: any, petID: string) {
  const pets = user.pets?.filter((pet: any) => {
    return pet.id !== petID;
  });

  return pets;
}

export function isValidMongooseID(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}
