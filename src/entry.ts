import http from 'http';
import { router } from './router.js';
import dotenv from 'dotenv';

dotenv.config();

//TODO: Add error handling for missing API key or API URL in .env file

const PORT = process.env.PORT || 8080; // default to 8080 if PORT is not set in .env

const server = http.createServer((req, res) => {
  router(req, res);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});