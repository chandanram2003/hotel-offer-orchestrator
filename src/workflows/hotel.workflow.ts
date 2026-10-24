
import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "../services/hotel.service";

const { selectBestOffersActivity } = proxyActivities<
  typeof activities
>({
  startToCloseTimeout: "30 seconds",
});

export async function hotelOfferWorkflow(
  supplierAHotels: activities.Hotel[],
  supplierBHotels: activities.Hotel[],
) {
  return await selectBestOffersActivity(
    supplierAHotels,
    supplierBHotels,
  );
}
