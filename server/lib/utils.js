import jwt from "jsonwebtoken";

const DEFAULT_JWT_SECRET = "2930e9f869d04d77a5f8a2821b703fd9e7df2a6f55738e9dd8749e08a103dc94";

// Function to generate a token for a user
export const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
    const token = jwt.sign({ userId }, secret, {
        expiresIn: "7d"
    });
    return token;
};