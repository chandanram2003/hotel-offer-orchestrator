
import Redis from "ioredis";
import type { Hotel } from "./hotel.service";

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT || 6379),
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

redis.on("error", (error: Error) => {
  console.error("Redis error:", error.message);
});

const getKeys = (city: string) => {
  const key = city.trim().toLowerCase();
  return {
    prices: `hotels:${key}:prices`,
    details: `hotels:${key}:details`,
  };
};

export async function cacheHotelOffers(
  city: string,
  hotels: Hotel[]
): Promise<void> {
  const { prices, details } = getKeys(city);
  const pipeline = redis.pipeline();

  pipeline.del(prices, details);

  for (const hotel of hotels) {
    const id = hotel.name.trim().toLowerCase();

    pipeline.zadd(prices, hotel.price, id);
    pipeline.hset(details, id, JSON.stringify(hotel));
  }

  const result = await pipeline.exec();

  if (result?.some(([error]) => error !== null)) {
    throw new Error("Failed to cache hotel offers");
  }
}

export async function getCachedHotelOffers(
  city: string,
  minPrice?: number,
  maxPrice?: number
): Promise<Hotel[]> {
  const { prices, details } = getKeys(city);

  const ids = await redis.zrangebyscore(
    prices,
    minPrice ?? "-inf",
    maxPrice ?? "+inf"
  );

  if (!ids.length) return [];

  const records = await redis.hmget(details, ...ids);

  return records
    .filter((record): record is string => record !== null)
    .map((record) => JSON.parse(record) as Hotel);
}

export default redis;
