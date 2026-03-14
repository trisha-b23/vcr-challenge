import http from 'http';
import { router } from './router.js';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.API_KEY || !process.env.WEATHER_API_URL) {
  console.error('API_KEY and WEATHER_API_URL must be set in .env');
  process.exit(1);
}

const PORT = process.env.PORT || 8080; // default to 8080 if PORT is not set in .env

const server = http.createServer((req, res) => {
  router(req, res);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});