import { Document } from "mongoose";

export interface ICountry extends Document {
  name: {
    common: string;
  };
  population: number;
  area: number;
  region: string;
  subregion: string;
  languages: Record<string, string>;
  borders: string[];
}

export interface GetCountries {
  page?: number;
  limit?: number;
  region?: string;
  minPopulation?: string;
  maxPopulation?: string;
}

export interface IPaginationMetadata {
  currentPage: number;
  lastPage: number;
  pageSize: number;
  totalRecord: number;
}

export interface AggregationResult {
  _id?: string;
  countries?: string[];
  totalPopulation?: number;
  totalSpeakers?: number;
  totalCountries?: number;
  largestCountry?: { name: string; area: number } | null;
  smallestCountry?: { name: string; population: number } | null;
  mostSpokenLanguage?: {
    _id: string;
    countries: string[];
    totalSpeakers: number;
  } | null;
}
