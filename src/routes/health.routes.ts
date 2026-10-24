
import { Router } from "express";
import redis from "../services/redis.service";

const router = Router();

router.get("/", async (_req, res) => {
  let redisStatus = "healthy";

  try {
    await redis.ping();
  } catch {
    redisStatus = "unhealthy";
  }

  const isHealthy = redisStatus === "healthy";

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "healthy" : "degraded",
    service: "Hotel Offer Orchestrator API",
    redis: redisStatus,
    timestamp: new Date().toISOString(),
  });
});

export default router;
