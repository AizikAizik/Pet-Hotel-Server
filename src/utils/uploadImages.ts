import { cloudinary } from "../config/cloudinary";

export async function uploadSingleImageFile(fileName: string) {
  const uploadedResponse = await cloudinary.v2.uploader.upload(fileName, {
    upload_preset: "ml_default",
  });
  //console.log(uploadedResponse);

  return uploadedResponse;
}
