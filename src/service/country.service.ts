import axios from "axios";
import { REST_COUNTRIES_API } from "../config";
import { ICountry, IPaginationMetadata } from "../types/customTypes";
import { logger } from "../utils/logger";
import RootService from "./root.service";
import {
  countryRepository,
  ICountryRepository,
} from "../repository/country.repository";
import { NotFoundError } from "../utils/error";

class CountryService extends RootService {
  countryRepository: ICountryRepository;
  constructor() {
    super();
  }

  public async fetchAndStoreCountries() {
    try {
      const response = await axios.get(REST_COUNTRIES_API);
      const countries = response.data;

      const clearDB = await countryRepository.DeleteAllCountries();
      const insertCountries = countryRepository.InsertCountriesToDb(
        countries.map((country: ICountry) => ({
          name: country.name.common,
          population: country.population,
          area: country.area,
          region: country.region || "Unknown",
          subregion: country.subregion || "Unknown",
          languages: country.languages || {},
          borders: country.borders || [],
        }))
      );
      const allCountries = countryRepository.GetAllCountries();

      const [insertCountriesResponse, allCountriesResponse] = await Promise.all(
        [insertCountries, allCountries]
      );

      if (
        clearDB.dbError ||
        insertCountriesResponse.dbError ||
        allCountriesResponse.dbError
      ) {
        const errorResponse = this.handleError(
          clearDB.dbError ||
            insertCountriesResponse.dbError ||
            allCountriesResponse.dbError
        );
        return this.processResponse(errorResponse);
      }

      logger.info("Countries successfully inserted into DataBase");
    } catch (error) {
      logger.error(
        "CountryService[fetchAndStoreCountries] processed a request with an error: ",
        error
      );
    }
  }

  public async getCountriesByFilter(
    page: number,
    limit: number,
    region?: string,
    minPopulation?: number,
    maxPopulation?: number
  ) {
    try {
      const skip = (page - 1) * limit;
      const filter: Record<string, any> = {};

      if (region) filter.region = region;
      if (minPopulation) filter.population = { $gte: Number(minPopulation) };
      if (maxPopulation) filter.population = { $lte: Number(maxPopulation) };

      let { countries, dbError, totalRecord } =
        await countryRepository.GetCountriesByFilter(filter, skip, limit, true);

      if (dbError) {
        const errorResponse = this.handleError(dbError);
        return this.processResponse(errorResponse);
      }
      const pagination: IPaginationMetadata = {
        currentPage: page,
        lastPage: Math.ceil(totalRecord / limit),
        pageSize: limit,
        totalRecord,
      };
      const responseObject = [{ pagination, countries }];
      return this.processResponse({
        status: true,
        statusCode: 200,
        message: "Countries fetched successfully",
        data: responseObject,
      });
    } catch (error) {
      logger.error(
        "CountryService[getCountries] processed a request with an error: ",
        error
      );
      return this.processResponse(this.getDefaultErrorResponse());
    }
  }

  public async getCountryById(id: string) {
    try {
      let { country, dbError } = await countryRepository.GetCountryById(id);
      if (dbError) {
        const errorResponse = this.handleError(dbError);
        return this.processResponse(errorResponse);
      }

      return this.processResponse({
        status: true,
        statusCode: 200,
        message: "Country fetched successfully ",
        data: country,
      });
    } catch (error) {
      logger.error(
        "CountryService[getCountryById] processed a request with an error: ",
        error
      );
      return this.processResponse(this.getDefaultErrorResponse());
    }
  }

  public async getCountriesInRegion() {
    try {
      const pipeline = [
        {
          $group: {
            _id: "$region",
            countries: { $push: "$name" },
            totalPopulation: { $sum: "$population" },
          },
        },
      ];
      let { country, dbError } = await countryRepository.CountryAggregatedData(
        pipeline
      );
      if (dbError) {
        const errorResponse = this.handleError(dbError);
        return this.processResponse(errorResponse);
      }
      return this.processResponse({
        status: true,
        statusCode: 200,
        message: "Countries fetched successfully ",
        data: country,
      });
    } catch (error) {
      logger.error(
        "CountryService[getCountryInRegion] processed a request with an error: ",
        error
      );
      return this.processResponse(this.getDefaultErrorResponse());
    }
  }

  public async getLanguages() {
    try {
      const pipeline = [
        { $unwind: "$languages" },
        {
          $group: {
            _id: "$languages",
            countries: { $push: "$name" },
            totalSpeakers: { $sum: "$population" },
          },
        },
      ];
      let { country, dbError } = await countryRepository.CountryAggregatedData(
        pipeline
      );
      if (dbError) {
        const errorResponse = this.handleError(dbError);
        return this.processResponse(errorResponse);
      }
      return this.processResponse({
        status: true,
        statusCode: 200,
        message: "Countries fetched successfully ",
        data: country,
      });
    } catch (error) {
      logger.error(
        "CountryService[getLanguages] processed a request with an error: ",
        error
      );
      return this.processResponse(this.getDefaultErrorResponse());
    }
  }

  public async getCountryStatistics() {
    try {
      const pipeline = [
        { $unwind: "$languages" },
        {
          $group: {
            _id: "$languages",
            totalSpeakers: { $sum: "$population" },
          },
        },
        { $sort: { totalSpeakers: -1 } },
        { $limit: 1 },
      ];
      const [response1, response2, response3, response4] = await Promise.all([
        countryRepository.CountAllCountries({}),
        countryRepository.GetLargestCountryByArea(),
        countryRepository.GetSmallestCountryByPopulation(),
        countryRepository.CountryAggregatedData(pipeline),
      ]);

      if (
        response1.dbError ||
        response2.dbError ||
        response3.dbError ||
        response4.dbError
      ) {
        const errorResponse = this.handleError(
          response1.dbError ||
            response2.dbError ||
            response3.dbError ||
            response4.dbError
        );
        return this.processResponse(errorResponse);
      }

      const totalCountries = response1.total;
      const largestCountry = response2.country;
      const smallestCountry = response3.country;
      const mostSpokenLanguage = response4.country[0];

      const responseObject = [
        { totalCountries },
        { largestCountry },
        { smallestCountry },
        { mostSpokenLanguage },
      ];

      return this.processResponse({
        status: true,
        statusCode: 200,
        message: "Statistics fetched successfully ",
        data: responseObject,
      });
    } catch (error) {
      logger.error(
        "CountryService[getCountryStatistics] processed a request with an error: ",
        error
      );
      return this.processResponse(this.getDefaultErrorResponse());
    }
  }

  private handleError(error: any) {
    let statusCode = 500;
    let message = "INTERNAL_SERVER_ERROR";

    if (error instanceof NotFoundError) {
      statusCode = error.statusCode;
      message = error.message;
    }

    return {
      status: false,
      statusCode,
      message,
      data: [],
    };
  }
}

const countryService = new CountryService();
export default countryService;
