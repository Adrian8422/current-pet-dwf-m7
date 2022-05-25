import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: "apxs",
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.SECRET_CLOUDINARY,
});

export { cloudinary };
