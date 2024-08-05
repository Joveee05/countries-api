import cors from "cors";
import { Application } from "express";
import { BASE_URL } from "../config";

const allowedOrigins: string[] = [BASE_URL];

export default function (app: Application) {
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg =
            "The CORS policy for this site does not " +
            "allow access from the specified Origin.";
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
    })
  );
}
