import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "iuhvr4z1",
    api_key: process.env.CLOUDINARY_API_KEY || "283868375234137",
    api_secret: process.env.CLOUDINARY_API_SECRET || "2bEWSemxLK2E9nLQRicVhiHjjtw",
});

export default cloudinary;