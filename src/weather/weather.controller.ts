import { IncomingMessage, ServerResponse } from 'http';
import { WeatherService } from './weather.service.js';
import { RequestValidator } from './weather.validation.js';
import { ErrorHandler } from '../shared/errors.js';

export class WeatherController {
  private weatherService: WeatherService;

  constructor() {
    this.weatherService = new WeatherService();
  }

  async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const baseURL = `http://${req.headers.host}`;
      const fullUrl = new URL(req.url || '', baseURL);
      const pathParts = fullUrl.pathname.split('/');
      
      // validation
      const { zipCode, scale } = RequestValidator.validateWeatherParams(
        pathParts[2], 
        fullUrl.searchParams.get('scale')
      );

      // get data
      const weatherData = await this.weatherService.getWeatherData(zipCode, scale);

      // send response
      ErrorHandler.sendJSON(res, 200, weatherData);

    } catch (error: unknown) {
      // handle errors
      ErrorHandler.handleError(res, error);
    }
  }
}