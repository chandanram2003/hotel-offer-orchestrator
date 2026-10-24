import { Router } from "express";

const router = Router();

const hotels = [
  {
    name: "Taj Hotel",
    city: "Delhi",
    price: 5000,
    commission: 10,
    supplier: "Supplier A"
  },
  {
    name: "Royal Inn",
    city: "Delhi",
    price: 3000,
    commission: 5,
    supplier: "Supplier A"
  },
  {
    name: "City Palace",
    city: "Delhi",
    price: 4000,
    commission: 6,
    supplier: "Supplier A"
  }
];

router.get("/hotels", (req, res) => {
  const city = String(req.query.city || "");

  const result = hotels.filter(
    (hotel) => hotel.city.toLowerCase() === city.toLowerCase()
  );

  res.json(result);
});

export default router;