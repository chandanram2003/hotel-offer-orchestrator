# Hotel Offer Orchestrator

A backend service built with Node.js, TypeScript, Temporal, and Redis to aggregate hotel offers from multiple suppliers.

## Tech Stack
- Node.js
- TypeScript
- Temporal
- Redis
- Docker and Docker Compose

## Features
- Fetch hotel offers by city
- Aggregate offers from multiple hotel suppliers
- Remove duplicate hotels by hotel name
- Select the lowest-priced offer for each hotel
- Filter hotels by minimum and maximum price
- Orchestrate processing with Temporal workflows

## API Endpoints

### Get Hotel Offers
`GET /api/hotels?city=Delhi`

### Filter by Minimum Price
`GET /api/hotels?city=Delhi&minPrice=4000`

### Filter by Maximum Price
`GET /api/hotels?city=Delhi&maxPrice=4000`

### Health Check
`GET /health`

## Run the Project

1. Install dependencies:

   `npm install`

2. Start the services:

   `docker compose up -d --build`

3. Start the API in one terminal:

   `npm run dev`

4. Start the Temporal worker in another terminal:

   `npm run worker`

5. Check the health endpoint:

   `http://localhost:3000/health`

## Service URLs
- API: http://localhost:3000
- Temporal UI: http://localhost:8233
- Redis: localhost:6379

## GitHub Repository
https://github.com/chandanram2003/hotel-offer-orchestrator
