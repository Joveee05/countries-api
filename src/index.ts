import app from "./app";
import { PORT } from "./config";
import countryService from "./service/country.service";
import "./database/index";
import { clearCache } from "./middlewares/cache";

app.listen(PORT, async () => {
  console.log(`API running on port ${PORT}...`);
  await countryService.fetchAndStoreCountries();
  await clearCache();
});

process.on("uncaughtException", (error) => {
  console.error({ uncaughtException: error });
});

process.on("unhandledRejection", function (error) {
  console.error({ unhandledRejection: error });
});

export default app;
