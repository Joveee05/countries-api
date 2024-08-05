import express, { Application } from "express";
import setupMiddleWares from "./middlewares";
import countryRoutes from "./routes/country.routes";
import setupSwagger from "./utils/swagger";

const app: Application = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

setupSwagger(app);

setupMiddleWares(app);

app.use("/api", countryRoutes);

export default app;
