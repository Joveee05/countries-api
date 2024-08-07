import axios from "axios";
import countryService from "../country.service";
import { countryRepository } from "../../repository/country.repository";
import { logger } from "../../utils/logger";
import { NotFoundError } from "../../utils/error";

jest.mock("axios");
jest.mock("../../repository/country.repository");
jest.mock("../../utils/logger");

describe("CountryService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchAndStoreCountries", () => {
    it("should fetch and store countries successfully", async () => {
      const mockCountries = [
        {
          name: { common: "Country1" },
          population: 1000,
          area: 500,
          region: "Region1",
          subregion: "Subregion1",
          languages: { en: "English" },
          borders: ["Country2"],
        },
        {
          name: { common: "Country2" },
          population: 2000,
          area: 1000,
          region: "Region2",
          subregion: "Subregion2",
          languages: { fr: "French" },
          borders: ["Country1"],
        },
      ];

      (axios.get as jest.Mock).mockResolvedValue({ data: mockCountries });
      (countryRepository.DeleteAllCountries as jest.Mock).mockResolvedValue({
        dbError: null,
      });
      (countryRepository.InsertCountriesToDb as jest.Mock).mockResolvedValue({
        dbError: null,
      });
      (countryRepository.GetAllCountries as jest.Mock).mockResolvedValue({
        dbError: null,
      });

      await countryService.fetchAndStoreCountries();

      expect(axios.get).toHaveBeenCalledWith(expect.any(String));
      expect(countryRepository.DeleteAllCountries).toHaveBeenCalled();
      expect(countryRepository.InsertCountriesToDb).toHaveBeenCalledWith(
        expect.any(Array)
      );
      expect(countryRepository.GetAllCountries).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        "Countries successfully inserted into DataBase"
      );
    });

    it("should log error if fetching countries fails", async () => {
      const mockError = new Error("Network error");

      (axios.get as jest.Mock).mockRejectedValue(mockError);

      await countryService.fetchAndStoreCountries();

      expect(logger.error).toHaveBeenCalledWith(
        "CountryService[fetchAndStoreCountries] processed a request with an error: ",
        mockError
      );
    });
  });

  describe("getCountriesByFilter", () => {
    it("should return countries by filter", async () => {
      const mockCountries = [
        {
          name: "Country1",
          population: 1000,
          area: 500,
          region: "Region1",
          subregion: "Subregion1",
          languages: { en: "English" },
          borders: ["Country2"],
        },
      ];
      const mockResponse = {
        countries: mockCountries,
        dbError: null,
        totalRecord: 1,
      };

      (countryRepository.GetCountriesByFilter as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const result = await countryService.getCountriesByFilter(
        1,
        10,
        "Region1",
        500,
        1500
      );

      expect(result.status).toBe(true);
      expect(result.data[0].countries).toEqual(mockCountries);
    });

    it("should return error response if repository fails", async () => {
      const mockDbError = { message: "DB error" };

      (countryRepository.GetCountriesByFilter as jest.Mock).mockResolvedValue({
        countries: [],
        dbError: mockDbError,
        totalRecord: 0,
      });

      const result = await countryService.getCountriesByFilter(1, 10);

      expect(result.status).toBe(false);
      expect(result.message).toBe("INTERNAL_SERVER_ERROR");
    });
  });
  describe("getCountryById", () => {
    it("should return country by id", async () => {
      const mockCountry = { name: "Country1", population: 1000, area: 500 };
      (countryRepository.GetCountryById as jest.Mock).mockResolvedValue({
        country: mockCountry,
        dbError: null,
      });

      const result = await countryService.getCountryById("1");

      expect(result.status).toBe(true);
      expect(result.data).toEqual(mockCountry);
    });

    it("should return error response if country not found", async () => {
      const mockDbError = new NotFoundError("Country not found");

      (countryRepository.GetCountryById as jest.Mock).mockResolvedValue({
        country: null,
        dbError: mockDbError,
      });

      const result = await countryService.getCountryById("1");

      expect(result.status).toBe(false);
      expect(result.message).toBe("Country not found");
    });
  });

  describe("getCountriesInRegion", () => {
    it("should return countries in region", async () => {
      const mockCountry = [
        { _id: "Region1", countries: ["Country1"], totalPopulation: 1000 },
      ];
      (countryRepository.CountryAggregatedData as jest.Mock).mockResolvedValue({
        country: mockCountry,
        dbError: null,
      });

      const result = await countryService.getCountriesInRegion();

      expect(result.status).toBe(true);
      expect(result.data).toEqual(mockCountry);
    });

    it("should return error response if repository fails", async () => {
      const mockDbError = { message: "DB error" };

      (countryRepository.CountryAggregatedData as jest.Mock).mockResolvedValue({
        country: [],
        dbError: mockDbError,
      });

      const result = await countryService.getCountriesInRegion();

      expect(result.status).toBe(false);
      expect(result.message).toBe("INTERNAL_SERVER_ERROR");
    });
  });

  describe("getLanguages", () => {
    it("should return languages with countries and total speakers", async () => {
      const mockLanguageData = [
        { _id: "English", countries: ["Country1"], totalSpeakers: 1000 },
      ];
      (countryRepository.CountryAggregatedData as jest.Mock).mockResolvedValue({
        country: mockLanguageData,
        dbError: null,
      });

      const result = await countryService.getLanguages();

      expect(result.status).toBe(true);
      expect(result.data).toEqual(mockLanguageData);
    });

    it("should return error response if repository fails", async () => {
      const mockDbError = { message: "DB error" };

      (countryRepository.CountryAggregatedData as jest.Mock).mockResolvedValue({
        country: [],
        dbError: mockDbError,
      });

      const result = await countryService.getLanguages();

      expect(result.status).toBe(false);
      expect(result.message).toBe("INTERNAL_SERVER_ERROR");
    });
  });

  describe("getCountryStatistics", () => {
    it("should return country statistics", async () => {
      const mockTotalCountries = { total: 195 };
      const mockLargestCountry = {
        country: { name: "Russia", area: 17098242 },
      };
      const mockSmallestCountry = {
        country: { name: "Vatican City", population: 800 },
      };
      const mockMostSpokenLanguage = [
        { _id: "English", totalSpeakers: 1500000000 },
      ];

      (countryRepository.CountAllCountries as jest.Mock).mockResolvedValue({
        ...mockTotalCountries,
        dbError: null,
      });
      (
        countryRepository.GetLargestCountryByArea as jest.Mock
      ).mockResolvedValue({ ...mockLargestCountry, dbError: null });
      (
        countryRepository.GetSmallestCountryByPopulation as jest.Mock
      ).mockResolvedValue({ ...mockSmallestCountry, dbError: null });
      (countryRepository.CountryAggregatedData as jest.Mock).mockResolvedValue({
        country: mockMostSpokenLanguage,
        dbError: null,
      });

      const result = await countryService.getCountryStatistics();

      expect(result.status).toBe(true);
      expect(result.data).toEqual([
        { totalCountries: mockTotalCountries.total },
        { largestCountry: mockLargestCountry.country },
        { smallestCountry: mockSmallestCountry.country },
        { mostSpokenLanguage: mockMostSpokenLanguage[0] },
      ]);
    });

    it("should return error response if any repository fails", async () => {
      const mockDbError = { message: "DB error" };

      (countryRepository.CountAllCountries as jest.Mock).mockResolvedValue({
        total: null,
        dbError: mockDbError,
      });
      (
        countryRepository.GetLargestCountryByArea as jest.Mock
      ).mockResolvedValue({ country: null, dbError: null });
      (
        countryRepository.GetSmallestCountryByPopulation as jest.Mock
      ).mockResolvedValue({ country: null, dbError: null });
      (countryRepository.CountryAggregatedData as jest.Mock).mockResolvedValue({
        country: [],
        dbError: null,
      });

      const result = await countryService.getCountryStatistics();

      expect(result.status).toBe(false);
      expect(result.message).toBe("INTERNAL_SERVER_ERROR");
    });
  });
});
