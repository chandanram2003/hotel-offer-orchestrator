import { Router } from "express";
import { getTemporalClient } from "../services/temporal.service";
import { hotelOfferWorkflow } from "../workflows/hotel.workflow";
import type { Hotel } from "../services/hotel.service";
import {
  cacheHotelOffers,
  getCachedHotelOffers,
} from "../services/redis.service";

const router = Router();

async function fetchSupplier(url: string): Promise<Hotel[]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Supplier failed: ${response.status}`);
  }

  return response.json() as Promise<Hotel[]>;
}

router.get("/", async (req, res) => {
  try {
    const city = String(req.query.city || "").trim();

    if (!city) {
      res.status(400).json({ error: "City is required" });
      return;
    }

    const minPrice =
      req.query.minPrice === undefined ? undefined : Number(req.query.minPrice);

    const maxPrice =
      req.query.maxPrice === undefined ? undefined : Number(req.query.maxPrice);

    if (
      (minPrice !== undefined &&
        (!Number.isFinite(minPrice) || minPrice < 0)) ||
      (maxPrice !== undefined &&
        (!Number.isFinite(maxPrice) || maxPrice < 0)) ||
      (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice)
    ) {
      res.status(400).json({ error: "Invalid price range" });
      return;
    }

    // Price-filtered requests read directly from Redis.
    if (minPrice !== undefined || maxPrice !== undefined) {
      const cachedHotels = await getCachedHotelOffers(city, minPrice, maxPrice);

      res.json(cachedHotels);
      return;
    }

    // Fetch suppliers concurrently.
    const [resultA, resultB] = await Promise.allSettled([
      fetchSupplier(
        `http://localhost:3000/supplierA/hotels?city=${encodeURIComponent(city)}`,
      ),
      fetchSupplier(
        `http://localhost:3000/supplierB/hotels?city=${encodeURIComponent(city)}`,
      ),
    ]);

    const hotelsA = resultA.status === "fulfilled" ? resultA.value : [];
    const hotelsB = resultB.status === "fulfilled" ? resultB.value : [];

    // Both suppliers failed: try Redis fallback.
    if (resultA.status === "rejected" && resultB.status === "rejected") {
      const cachedHotels = await getCachedHotelOffers(city);

      if (cachedHotels.length > 0) {
        res.setHeader("x-cache-fallback", "true");
        res.json(cachedHotels);
        return;
      }

      res.status(503).json({
        error: "Both suppliers are unavailable and no cache exists",
      });
      return;
    }

    const temporalClient = await getTemporalClient();

    const bestOffers = await temporalClient.workflow.execute(
      hotelOfferWorkflow,
      {
        taskQueue: "hotel-offer-queue",
        workflowId: `hotel-offers-${city.toLowerCase()}-${Date.now()}`,
        args: [hotelsA, hotelsB],
      },
    );

    // Cache the combined best offers.
    await cacheHotelOffers(city, bestOffers);

    // Report partial supplier failure.
    if (resultA.status === "rejected" || resultB.status === "rejected") {
      const failedSuppliers = [
        ...(resultA.status === "rejected" ? ["Supplier A"] : []),
        ...(resultB.status === "rejected" ? ["Supplier B"] : []),
      ];

      res.setHeader("x-degraded-suppliers", failedSuppliers.join(","));
    }

    res.json(bestOffers);
  } catch (error) {
    console.error("Hotel API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
