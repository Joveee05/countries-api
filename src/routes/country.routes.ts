import { Router } from "express";
import {
  getCountries,
  getCountryById,
  getRegions,
  getLanguages,
  getStatistics,
  apiResponse,
} from "../controller/country.controller";

const router: Router = Router();

router.get("/", apiResponse);
router.get("/countries", getCountries);
router.get("/countries/:id", getCountryById);
router.get("/languages", getLanguages);
router.get("/regions", getRegions);
router.get("/statistics", getStatistics);

/**
 * @swagger
 * tags:
 *   name: Countries
 *   description: Country management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Country:
 *       type: object
 *       required:
 *         - name
 *         - population
 *         - area
 *         - region
 *         - subregion
 *         - languages
 *         - borders
 *       properties:
 *         name:
 *           type: string
 *         population:
 *           type: number
 *         area:
 *           type: number
 *         region:
 *           type: string
 *         subregion:
 *           type: string
 *         languages:
 *           type: object
 *           additionalProperties:
 *             type: string
 *         borders:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /countries:
 *   get:
 *     summary: Retrieve a list of countries with pagination and optional filtering
 *     tags: [Countries]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of countries per page
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Filter by region
 *       - in: query
 *         name: minPopulation
 *         schema:
 *           type: integer
 *         description: Minimum population
 *       - in: query
 *         name: maxPopulation
 *         schema:
 *           type: integer
 *         description: Maximum population
 *     responses:
 *       200:
 *         description: A list of countries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Country'
 */

/**
 * @swagger
 * /countries/{id}:
 *   get:
 *     summary: Retrieve detailed information for a specific country
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Country ID
 *     responses:
 *       200:
 *         description: Country data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *       404:
 *         description: Country not found
 */

/**
 * @swagger
 * /regions:
 *   get:
 *     summary: Retrieve a list of regions and the countries within each region
 *     tags: [Regions]
 *     responses:
 *       200:
 *         description: A list of regions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   countries:
 *                     type: array
 *                     items:
 *                       type: string
 *                   totalPopulation:
 *                     type: number
 */

/**
 * @swagger
 * /languages:
 *   get:
 *     summary: Retrieve a list of languages and the countries where they are spoken
 *     tags: [Languages]
 *     responses:
 *       200:
 *         description: A list of languages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   countries:
 *                     type: array
 *                     items:
 *                       type: string
 *                   totalSpeakers:
 *                     type: number
 */

/**
 * @swagger
 * /statistics:
 *   get:
 *     summary: Provide aggregated statistics about countries
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Aggregated statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCountries:
 *                   type: number
 *                 largestCountry:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     area:
 *                       type: number
 *                 smallestCountry:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     population:
 *                       type: number
 *                 mostSpokenLanguage:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     totalSpeakers:
 *                       type: number
 */

export default router;
