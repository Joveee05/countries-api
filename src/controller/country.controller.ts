import { NextFunction, Request, Response } from "express";
import countryService from "../service/country.service";
import { logger } from "../utils/logger";
import { GetCountries } from "../types/customTypes";
import { setCache } from "../middlewares/cache";

export async function getCountries(
  req: Request<GetCountries>,
  res: Response,
  next: NextFunction
) {
  logger.info("CountryController[getCountries] processed a request");
  try {
    const {
      page = 1,
      limit = 10,
      region,
      minPopulation,
      maxPopulation,
    } = req.query;
    const countries = await countryService.getCountriesByFilter(
      Number(page),
      Number(limit),
      region as string,
      minPopulation ? Number(minPopulation) : undefined,
      maxPopulation ? Number(maxPopulation) : undefined
    );
    await setCache(req.originalUrl, countries);
    res.json(countries);
  } catch (error) {
    logger.error(
      "CountryController[getCountries] processed a request with an error: ",
      error
    );
    next(error);
  }
}

export async function getCountryById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  logger.info("CountryController[getCountryById] processed a request");
  try {
    const { id } = req.params;
    const country = await countryService.getCountryById(id);
    await setCache(req.originalUrl, country);
    res.json(country);
  } catch (error) {
    logger.error(
      "CountryController[getCountryById] processed a request with an error: ",
      error
    );
    next(error);
  }
}

export async function getRegions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info("CountryController[getRegions] processed a request");
  try {
    const regions = await countryService.getCountriesInRegion();
    await setCache(req.originalUrl, regions);
    res.json(regions);
  } catch (error) {
    logger.error(
      "CountryController[getRegions] processed a request with an error: ",
      error
    );
    next(error);
  }
}

export async function getLanguages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info("CountryController[getLanguages] processed a request");
  try {
    const languages = await countryService.getLanguages();
    await setCache(req.originalUrl, languages);
    res.json(languages);
  } catch (error) {
    logger.error(
      "CountryController[getLanguages] processed a request with an error: ",
      error
    );
    next(error);
  }
}

export async function getStatistics(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info("CountryController[getStatistics] processed a request");
  try {
    const statistics = await countryService.getCountryStatistics();
    await setCache(req.originalUrl, statistics);
    res.json(statistics);
  } catch (error) {
    logger.error(
      "CountryController[getStatistics] processed a request with an error: ",
      error
    );
    next(error);
  }
}
