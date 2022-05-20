import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: "apxs",
  api_key: "634495134523375",
  api_secret: process.env.SECRET_CLOUDINARY,
});

export { cloudinary };
