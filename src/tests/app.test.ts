import request from "supertest";
import express from "express";
import countryRoutes from "../routes/country.routes";
import countryService from "../service/country.service";
import setupSwagger from "../utils/swagger";
import "../database/index";

const app = express();
app.use(express.json());
app.use("/api", countryRoutes);
setupSwagger(app);

// Mock CountryService methods
jest.mock("../service/country.service");

describe("Country API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/countries", () => {
    it("should retrieve a list of countries", async () => {
      const mockCountries = [
        {
          name: "Country1",
          population: 1000000,
          area: 1000,
          region: "Region1",
          subregion: "Subregion1",
          languages: { language1: "Language1" },
          borders: ["Country2"],
        },
        {
          name: "Country2",
          population: 2000000,
          area: 2000,
          region: "Region2",
          subregion: "Subregion2",
          languages: { language2: "Language2" },
          borders: ["Country1"],
        },
      ];

      (countryService.getCountriesByFilter as jest.Mock).mockResolvedValue(
        mockCountries
      );

      const response = await request(app).get("/api/countries");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCountries);
      expect(countryService.getCountriesByFilter).toHaveBeenCalledTimes(1);
    });

    // Add more integration tests for other endpoints
    describe("GET /api/countries/:id", () => {
      it("should retrieve a country", async () => {
        const mockCountry = {
          name: "Country1",
          population: 1000000,
          area: 1000,
          region: "Region1",
          subregion: "Subregion1",
          languages: { language1: "Language1" },
          borders: ["Country2"],
        };
        (countryService.getCountryById as jest.Mock).mockResolvedValue(
          mockCountry
        );

        const response = await request(app).get("/api/countries/:id");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockCountry);
        expect(countryService.getCountryById).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("GET /api/regions", () => {
    it("should retrieve a list of regions", async () => {
      const mockRegions = [
        {
          _id: "Region1",
          countries: ["Country1", "Country2"],
          totalPopulation: 3000000,
        },
      ];

      (countryService.getCountriesInRegion as jest.Mock).mockResolvedValue(
        mockRegions
      );

      const response = await request(app).get("/api/regions");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRegions);
      expect(countryService.getCountriesInRegion).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /api/languages", () => {
    it("should retrieve a list of languages", async () => {
      const mockLanguages = [
        {
          _id: "Language1",
          countries: ["Country1"],
          totalSpeakers: 1000000,
        },
      ];

      (countryService.getLanguages as jest.Mock).mockResolvedValue(
        mockLanguages
      );

      const response = await request(app).get("/api/languages");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockLanguages);
      expect(countryService.getLanguages).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /api/statistics", () => {
    it("should retrieve aggregated statistics", async () => {
      const mockStatistics = {
        totalCountries: 2,
        largestCountry: { name: "Country2", area: 2000 },
        smallestCountry: { name: "Country1", population: 1000000 },
        mostSpokenLanguage: { _id: "Language1", totalSpeakers: 1000000 },
      };

      (countryService.getCountryStatistics as jest.Mock).mockResolvedValue(
        mockStatistics
      );

      const response = await request(app).get("/api/statistics");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStatistics);
      expect(countryService.getCountryStatistics).toHaveBeenCalledTimes(1);
    });
  });
});
