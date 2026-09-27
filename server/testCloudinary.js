import "dotenv/config";
import cloudinary from "./lib/cloudinary.js";

const testUpload = async () => {
    try {
        const result = await cloudinary.uploader.upload(
            "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            {
                resource_type: "image"
            }
        );

        console.log("UPLOAD SUCCESS");
        console.log("IMAGE URL:", result.secure_url);

    } catch (error) {
        console.log("UPLOAD ERROR");
        console.log("STATUS:", error.http_code);
        console.log("MESSAGE:", error.message);
        console.log("FULL ERROR:", error);
    }
};

testUpload();