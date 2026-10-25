
import { Router } from "express";

const router = Router();

const hotels = [
  {
    name: "Taj Hotel",
    city: "Delhi",
    price: 4500,
    commission: 8,
    supplier: "Supplier B",
  },
  {
    name: "Royal Inn",
    city: "Delhi",
    price: 3000,
    commission: 7,
    supplier: "Supplier B",
  },
  {
    name: "City Palace",
    city: "Delhi",
    price: 4200,
    commission: 9,
    supplier: "Supplier B",
  },
];

router.get("/hotels", (req, res) => {
  const city = String(req.query.city || "");

  const result = hotels.filter(
    (hotel) => hotel.city.toLowerCase() === city.toLowerCase(),
  );

  res.json(result);
});

export default router;
