import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";
import { logger } from "../utils/logger";
import { REDIS_URL } from "../config";

const client = createClient({ url: REDIS_URL });

client.on("error", (error) => {
  console.error("RedisClient eror: ", error);
});

client.connect();

export const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key = req.originalUrl;

  try {
    const data = await client.get(key);

    if (data !== null) {
      res.send(JSON.parse(data));
      logger.info("Redis cache processed and returned data");
    } else {
      next();
    }
  } catch (error) {
    console.error("[RedisCacheMiddleware] Redis error: ", error);
    next();
  }
};

export const setCache = async (key: any, value: any) => {
  try {
    await client.setEx(key, 3600, JSON.stringify(value)); // Cache expires in 1 hour
  } catch (error) {
    logger.error("[RedisSetCache] Redis error: ", error);
  }
};
