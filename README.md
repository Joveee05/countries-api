# Country Information API

## Overview

This API provides detailed information about countries, regions, and languages by fetching and processing data from the REST Countries API. The API supports various endpoints for retrieving country details, aggregated statistics, and language data. The application was built using Node.js, TypeScript, and Express, with MongoDB as the database and Redis for caching.

This API is hosted at [https://countries-api-jns9.onrender.com/api](https://countries-api-jns9.onrender.com/api).

\*\*Note - This API is hosted as a free instance on [Render](https://render.com) and as a result, it spins down due to inactivity. Initial requests after a period of API inactivity might take 30-50seconds.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Implementation Approach](#implementation-approach)
- [Challenges and Features](#challenges-and-features)
- [Highlights](#highlights)
- [Potential Improvements](#potential-improvements)

## Setup Instructions

### Prerequisites

- Node.js (v14.x or higher)
- MongoDB
- Redis

### Environment Configuration

Create a `.env` file in the src directory of the project and add the following environment variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/countrydb
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REST_COUNTRIES_API=https://restcountries.com/v3.1/all
BASE_URL=http://localhost:3000/api
```

### Installation

1. Clone the repository

```
git clone https://github.com/Joveee05/countries-api.git

cd src
```

2. Install dependencies

```
npm install
```

3. Start the Mongodb and Redis servers locally

4. Start the server

- First

```
npm run build
```

- Then

```
npm start
```

The API will be running at `http://localhost:3000/api`

### Tests

```
npm run test
```

## API Endpoints

- GET /api/countries: Retrieves a list of countries with pagination and optional filtering by region or population size.

- GET /api/countries/:id: Retrieves detailed information for a specific country, including its languages, population, area, and bordering countries.

- GET /api/regions: Retrieves a list of regions and the countries within each region, with additional aggregated data such as the total population of the region.

- GET /api/languages: Retrieves a list of languages and the countries where they are spoken. Includes the total number of speakers globally for each language.

- GET /api/statistics: Provides aggregated statistics such as the total number of countries, the largest country by area, the smallest by population, and the most widely spoken language.

## Implementation Approach

1. Data Fetching: Fetch data from the REST Countries API and store it in MongoDB for persistent storage and Redis for caching.

2. Repository Pattern: Implemented repository classes to handle database operations.

3. Service Layer: Added a service layer to encapsulate business logic and data processing.

4. Controller Layer: Created controllers to handle HTTP requests and responses.

5. Error Handling: Implemented centralized error handling and logging.

6. Testing: Added unit and integration tests using Jest to ensure code quality and reliability.

## Challenges and Features

### Interesting Challenges

- Testing: Unit and integration tests to ensure reliability and maintainability.
- Data and API Response Consistency: Ensuring data consistency when fetching and storing data from the REST Countries API.
- Performance: Optimizing performance with caching and efficient data processing.

### Interesting Features

- Aggregation Pipelines: Used MongoDB aggregation pipelines to efficiently compute statistics and aggregate data.

- Caching: Implemented Redis caching to reduce database load and improve response times.

## Highlights

- Robust Architecture: The API is built with a clear separation of concerns using repository, service, and controller layers.

- Comprehensive Documentation: Detailed API documentation is provided using Swagger.

- Error Handling: Proper error handling for database operations.

- Extensive Testing: Both unit and integration tests are included to ensure reliability and maintainability.

## Potential Improvements

- Rate Limiting: Implement rate limiting to prevent abuse and ensure fair usage.

- Input Validation: Validate and sanitize all input received from clients and other sources to prevent common security vulnerabilities like injection attacks.

- Advanced Filtering: Enhance filtering capabilities with more query parameters and options.

- Authenticaation and Authorization: Implement authentication and authorization mechanisms to ensure that only authorized users can access the API.

- Scalability: Implement additional performance optimizations and scalability features for handling larger datasets and higher traffic.
