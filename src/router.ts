import { IncomingMessage, ServerResponse } from 'http';
import { WeatherController } from './weather/weather.controller.js';

const weatherController = new WeatherController();

export const router = async (req: IncomingMessage, res: ServerResponse) => {
  const baseURL = `http://${req.headers.host}`;
  const parsedUrl = new URL(req.url || '', baseURL);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Route: GET /locations/:zip
  if (method === 'GET' && path.startsWith('/locations/')) {
    return weatherController.handleRequest(req, res);
  }
  // 404 Catch-all
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Route not found' }));
};