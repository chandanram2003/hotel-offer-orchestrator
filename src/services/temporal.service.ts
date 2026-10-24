
import "dotenv/config";
import { Connection, Client } from "@temporalio/client";

let temporalClientPromise: Promise<Client> | undefined;

export function getTemporalClient(): Promise<Client> {
  if (!temporalClientPromise) {
    temporalClientPromise = Connection.connect({
      address: process.env.TEMPORAL_ADDRESS || "localhost:7233",
    }).then((connection) => new Client({ connection }));
  }

  return temporalClientPromise;
}
