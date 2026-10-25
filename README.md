# Hotel Offer Orchestrator

A backend service built with Node.js, TypeScript, Express.js, Temporal, and Redis to aggregate hotel offers from multiple suppliers and select the best offers.

## Features

- Fetch hotel offers by city
- Aggregate offers from Supplier A and Supplier B
- Remove duplicate hotels by hotel name
- Select the best offers based on price and commission
- Filter offers by minimum and maximum price
- Cache results using Redis
- Handle supplier failures with fallback support
- Process offers using Temporal workflows and workers
- Health check endpoint

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Redis
- Temporal
- Docker and Docker Compose

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check API health |
| GET | `/api/hotels?city=Delhi` | Get hotel offers for a city |
| GET | `/api/hotels?city=Delhi&minPrice=3000&maxPrice=4000` | Filter offers by price |
| GET | `/supplierA/hotels?city=Delhi` | Fetch Supplier A offers |
| GET | `/supplierB/hotels?city=Delhi` | Fetch Supplier B offers |

## Run the Project

### 1. Start Docker Desktop

Make sure Docker Desktop is running.

### 2. Open the project folder

```bash
cd D:\My_allproject\hotel-offer-orchestrator
```

### 3. Start the services

```bash
docker compose up -d --build
```

### 4. Check service status

```bash
docker compose ps
```

## Service URLs

- API Health: http://localhost:3001/health
- Hotel Offers: http://localhost:3001/api/hotels?city=Delhi
- Temporal UI: http://localhost:8233
- Redis: localhost:6379

## GitHub Repository

https://github.com/chandanram2003/hotel-offer-orchestrator
