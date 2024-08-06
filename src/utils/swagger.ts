import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import { BASE_URL } from "../config";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Country API",
      version: "1.0.0",
      description: "API for managing and retrieving country data",
    },
    servers: [
      {
        url: BASE_URL,
      },
    ],
  },
  apis: ["./routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app: Application): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
