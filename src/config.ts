import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const REDIS_URL = process.env.REDIS_URL as string;
export const MONGO_URI = process.env.MONGO_URI as string;
export const REST_COUNTRIES_API = process.env.REST_COUNTRIES_API as string;
