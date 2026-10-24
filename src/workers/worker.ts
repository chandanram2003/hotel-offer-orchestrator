import "dotenv/config";
import { NativeConnection, Worker } from "@temporalio/worker";
import * as activities from "../services/hotel.service";

async function runWorker() {
  const connection = await NativeConnection.connect({
    address: process.env.TEMPORAL_ADDRESS || "localhost:7233",
  });

  const worker = await Worker.create({
    connection,
    namespace: "default",
    taskQueue: "hotel-offer-queue",
    workflowsPath: require.resolve("../workflows/hotel.workflow"),
    activities: {
      selectBestOffersActivity: activities.selectBestOffersActivity,
    },
  });

  console.log("Temporal worker started on hotel-offer-queue");

  await worker.run();
}

runWorker().catch((error) => {
  console.error("Temporal worker failed:", error);
  process.exit(1);
});
