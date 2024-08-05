import mongoose from "mongoose";
import { MONGO_URI } from "../config";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("DataBase connected successfully!"))
  .catch((error) => console.error(error));
