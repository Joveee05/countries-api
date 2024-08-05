import express, { Application } from "express";
import morgan from "morgan";
import compression from "compression";
import useCorsMiddleware from "./cors.middleware";
import useRequestMiddleware from "./request.middleware";
import { cacheMiddleware } from "./cache";
import helmet from "helmet";

const middlewares = (app: Application) => {
  app.use(compression());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(morgan("combined"));
  app.use(helmet());
  app.use(cacheMiddleware);

  useCorsMiddleware(app);
  useRequestMiddleware(app);
};

export default middlewares;
