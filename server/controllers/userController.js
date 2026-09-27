import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"

// Signup a new user
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Details" })
        }
        const user = await User.findOne({ email });

        if (user) {
            return res.json({ success: false, message: "Account already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio
        });

        const token = generateToken(newUser._id)

        res.json({ success: true, userData: newUser, token, message: "Account created successfully" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Controller to login a user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email })

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(userData._id)

        res.json({ success: true, userData, token, message: "Login successful" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Controller to check if user is authenticated
export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user });
}

// Controller to update user profile details
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id;

        const updateFields = {};
        if (bio !== undefined) updateFields.bio = bio;
        if (fullName !== undefined) updateFields.fullName = fullName;

        if (profilePic) {
            let finalProfilePic = profilePic;
            if (typeof profilePic === "string" && profilePic.startsWith("data:image")) {
                try {
                    const upload = await cloudinary.uploader.upload(profilePic);
                    if (upload && upload.secure_url) {
                        finalProfilePic = upload.secure_url;
                    }
                } catch (cloudErr) {
                    console.log("Cloudinary profile upload warning, using direct image fallback:", cloudErr.message);
                }
            }
            updateFields.profilePic = finalProfilePic;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select("-password");
        res.json({ success: true, user: updatedUser, message: "Profile updated successfully" });

    } catch (error) {
        console.log("PROFILE UPDATE ERROR:", error);
        res.json({ success: false, message: error.message });
    }
}