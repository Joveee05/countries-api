import mongoose, { Schema } from "mongoose";
import { ICountry } from "../types/customTypes";

const countrySchema: Schema = new Schema<ICountry>(
  {
    name: { type: String, required: true },
    population: { type: Number, required: true },
    area: { type: Number, required: true },
    region: { type: String, required: true },
    subregion: { type: String, required: true },
    languages: { type: Object, required: true },
    borders: { type: [String], required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<ICountry>("Country", countrySchema);
