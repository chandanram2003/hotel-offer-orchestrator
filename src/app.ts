
import express from "express";
import cors from "cors";

import supplierARouter from "./suppliers/supplierA";
import supplierBRouter from "./suppliers/supplierB";
import hotelRouter from "./routes/hotel.routes";
import healthRouter from "./routes/health.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Root API
app.get("/", (_req, res) => {
  res.send("Hotel Offer Orchestrator API is running!");
});

// Health check API
app.use("/health", healthRouter);

// Mock supplier APIs
app.use("/supplierA", supplierARouter);
app.use("/supplierB", supplierBRouter);

// Main hotel comparison API
app.use("/api/hotels", hotelRouter);

export default app;
