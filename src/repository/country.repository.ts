import mongoose from "mongoose";
import Country from "../model/country.model";
import { AggregationResult, ICountry } from "../types/customTypes";
import { BadRequestError, NotFoundError } from "../utils/error";
import { logger } from "../utils/logger";

interface ICountryRepository {
  GetCountriesByFilter(
    filter: Record<string, any>,
    page: number,
    limit: number,
    returnTotalCount: boolean
  ): Promise<{ countries?: ICountry[]; dbError?: Error; totalRecord?: number }>;

  GetAllCountries(): Promise<{
    country?: ICountry[];
    dbError?: Error;
  }>;

  GetCountryById(
    id: string
  ): Promise<{ country?: ICountry | null; dbError?: Error }>;

  CountryAggregatedData(
    pipeline: any[]
  ): Promise<{ country?: AggregationResult[]; dbError?: Error }>;

  CountAllCountries(
    filter: Record<string, any>
  ): Promise<{ total?: number; dbError?: Error }>;
  DeleteAllCountries(): Promise<{
    success?: boolean;
    dbError?: Error;
  }>;

  InsertCountriesToDb(
    country: ICountry[]
  ): Promise<{ country?: ICountry[]; dbError?: Error }>;

  GetLargestCountryByArea(): Promise<{
    country?: ICountry | null;
    dbError?: Error;
  }>;

  GetSmallestCountryByPopulation(): Promise<{
    country?: ICountry | null;
    dbError?: Error;
  }>;
}

class CountryRepository implements ICountryRepository {
  public async GetCountriesByFilter(
    filter: Record<string, any>,
    page: number,
    limit: number,
    returnTotalCount?: boolean
  ): Promise<{
    countries?: ICountry[];
    dbError?: Error;
    totalRecord?: number;
  }> {
    try {
      let totalRecord: undefined | number;
      if (returnTotalCount) {
        const [countries, allCountriesCount] = await Promise.all([
          Country.find(filter).limit(limit).skip(page).exec(),
          this.CountAllCountries(filter),
        ]);
        totalRecord = Number(allCountriesCount.total);
        return { countries, totalRecord };
      } else {
        const countries = await Country.find(filter)
          .limit(limit)
          .skip(page)
          .exec();
        return { countries };
      }
    } catch (error) {
      logger.error("CountryRepository[GetCountriesByFilter]: ", error);
      return { dbError: error as Error };
    }
  }

  public async GetAllCountries(): Promise<{
    country?: ICountry[];
    dbError?: Error;
  }> {
    try {
      const country = await Country.find().exec();
      return { country };
    } catch (error) {
      logger.error("CountryRepository[GetAllCountries]: ", error);
      return { dbError: error as Error };
    }
  }

  public async GetCountryById(
    id: string
  ): Promise<{ country?: ICountry | null; dbError?: Error }> {
    try {
      const country = await Country.findById(id);
      if (!country) {
        throw new NotFoundError(`Country with id: ${id} not found`);
      }
      return { country };
    } catch (error) {
      logger.error("CountryRepository[GetCountryById]: ", error);
      return { dbError: error as Error };
    }
  }

  public async CountryAggregatedData(
    pipeline: any[]
  ): Promise<{ country?: AggregationResult[]; dbError?: Error }> {
    try {
      const country = await Country.aggregate(pipeline).exec();
      return { country };
    } catch (error) {
      logger.error("CountryRepository[CountryAggregatedData]: ", error);
      return { dbError: error as Error };
    }
  }

  public async CountAllCountries(filter: Record<string, any>): Promise<{
    total?: number;
    dbError?: Error;
  }> {
    try {
      const total = await Country.countDocuments(filter).exec();
      return { total };
    } catch (error) {
      logger.error("CountryRepository[CountAllCountries]: ", error);
      return { dbError: error as Error };
    }
  }

  public async DeleteAllCountries(): Promise<{
    success?: boolean;
    dbError?: Error;
  }> {
    try {
      await Country.deleteMany();
      return { success: true };
    } catch (error) {
      logger.error("CountryRepository[DeleteAllCountries]: ", error);
      return { dbError: error as Error };
    }
  }

  public async InsertCountriesToDb(
    country: ICountry[]
  ): Promise<{ country?: ICountry[]; dbError?: Error }> {
    try {
      await Country.insertMany(country);
      return { country };
    } catch (error) {
      logger.error("CountryRepository[InsertCountriesToDb]: ", error);
      return { dbError: error as Error };
    }
  }

  public async GetLargestCountryByArea(): Promise<{
    country?: ICountry | null;
    dbError?: Error;
  }> {
    try {
      const country = await Country.findOne().sort("-area").select("name area");
      return { country };
    } catch (error) {
      logger.error("CountryRepository[GetLargestCountry]: ", error);
      return { dbError: error as Error };
    }
  }

  public async GetSmallestCountryByPopulation(): Promise<{
    country?: ICountry | null;
    dbError?: Error;
  }> {
    try {
      const country = await Country.findOne()
        .sort("population")
        .select("name population");
      return { country };
    } catch (error) {
      logger.error("CountryRepository[GetLargestCountry]: ", error);
      return { dbError: error as Error };
    }
  }
}

const countryRepository = new CountryRepository();
export { ICountryRepository, countryRepository };
