 # Weather Service API

An API that returns the current temperature for a given location code. Built with Node.js and TypeScript. Used [WeatherAPI](https://www.weatherapi.com) for the API key. 

## Setup

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file in the root directory using `example.env` as a reference:
```
WEATHER_API_URL="your_weather_api_url_here"
API_KEY="your_api_key_here"
PORT="your_port_number_here"
```
4. Run `npm start`

The server will be available at `http://localhost:8080`, or at whichever port number specified in the .env file. The application will use port 8080 by default if not specified. 

---

## Usage

### Endpoint

```
GET /locations/{location-code}
```

### Query Parameters

| Parameter | Required | Default     | Values                  |
|-----------|----------|-------------|-------------------------|
| `scale`   | No       | `Fahrenheit`| `Fahrenheit`, `Celsius` |

### Accepted Location Formats

The WeatherAPI supports three location formats:

| Country | Format | Example |
|---------|--------|---------|
| United States | 5-digit zip code | `24060` |
| *United Kingdom | Full or partial postcode | `SW1A 1AA`, `SW1` |
| *Canada | Postal code | `K1A 0A6` |

*Refer to Implementation Decisions

### Example Requests

**Get temperature in Fahrenheit (default):**
```
GET /locations/24060
```
```json
{
    "temperature": 63.1,
    "scale": "Fahrenheit"
}
```

**Get temperature in Celsius:**
```
GET /locations/90210?scale=Celsius
```
```json
{
    "temperature": 17.3,
    "scale": "Celsius"
}
```

---

## Error Responses

| Status | Error | Reason |
|--------|-------|--------|
| 400 | `A location is required` | No location code provided |
| 400 | `A valid zip code is required. Please enter a US, UK, or Canada location code.` | Unrecognized location format |
| 400 | `Invalid scale. Use "Celsius" or "Fahrenheit"` | Invalid scale parameter |
| 404 | `Location is not found. Please check the code and try again.` | Location code not found |
| 503 | `The Weather API is temporarily unavailable.` | WeatherAPI is unreachable |

---

## Running Tests

```
npm test
```

Tests cover the validation layer and the weather service, including mocked API responses.

---

## Project Structure

```
src/
├── entry.ts              # Application entry point, env validation, server setup
├── router.ts             # Route matching
├── weather/
│   ├── weather.controller.ts   # Handles requests and responses
│   ├── weather.service.ts      # Fetches and processes data from WeatherAPI
│   ├── weather.validation.ts   # Validates incoming request parameters
│   └── weather.dto.ts          # TypeScript interfaces and types
└── shared/
    └── errors.ts               # Centralized error handling

tests/
├── weather.validation.test.ts
└── weather.service.test.ts
```

---

## Implementation Decisions

### No framework
I deliberately avoided using Express to keep dependencies minimal and demonstrate comfort with Node's built-in `http` module. For a production application at scale, adopting a framework would be a reasonable next step.

### Layered architecture
The codebase is organized into distinct layers: routing, controller, service, validation, and error handling. This makes the code easier to maintain, test, and extend. Adding a new route would mean adding a new controller/service/validation set without touching existing code.

### Validation strategy
Input is validated before any external calls are made. The WeatherAPI's own error responses (specifically error code 1006 for location not found) serve as the final call for whether a location actually exists. The local validation layer exists purely to catch obviously malformed input and avoid unnecessary API calls.

### UK and Canada support
The spec only mentioned zip codes, but after reviewing the WeatherAPI documentation I found that it also accepts UK postcodes and Canadian postal codes. I extended the validation layer to support all three formats since the underlying API supports them and it makes the application more useful without adding meaningless complexity.

### Environment variables
The API key and API URL are loaded from environment variables rather than hardcoded. The application performs a startup check and exits immediately with a console message if either is missing, rather than failing on the first request.

---

## AI Tools & References
- **VSCode Ask Mode (GitHub Copilot) & Gemini** - used for TypeScript syntax clarification and testing framework setup
- [WeatherAPI Documentation](https://www.weatherapi.com/docs/)
- [MDN HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
