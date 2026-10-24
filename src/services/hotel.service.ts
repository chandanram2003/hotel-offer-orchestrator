
export interface Hotel {
  name: string;
  city: string;
  price: number;
  commission: number;
  supplier: string;
}

export function selectBestOffers(
  supplierAHotels: Hotel[],
  supplierBHotels: Hotel[],
): Hotel[] {
  const bestOffers = new Map<string, Hotel>();

  for (const hotel of [...supplierAHotels, ...supplierBHotels]) {
    const key = hotel.name.trim().toLowerCase();
    const existing = bestOffers.get(key);

    if (
      !existing ||
      hotel.price < existing.price ||
      (hotel.price === existing.price &&
        hotel.commission > existing.commission)
    ) {
      bestOffers.set(key, hotel);
    }
  }

  return [...bestOffers.values()];
}

// Temporal Activity
export async function selectBestOffersActivity(
  supplierAHotels: Hotel[],
  supplierBHotels: Hotel[],
): Promise<Hotel[]> {
  return selectBestOffers(supplierAHotels, supplierBHotels);
}
