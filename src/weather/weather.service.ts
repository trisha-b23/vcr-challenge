import axios, { AxiosError } from 'axios';
import type { RawResponse, ProcessedResponse, TempScale, WeatherAPIError } from './weather.dto.js';

export class WeatherService {
  // The non-null assertion operator (!) is used here because we have already checked for the presence of 
  // these environment variables in entry.ts.
  private readonly apiKey = process.env.API_KEY!;
  private readonly baseUrl = process.env.WEATHER_API_URL!;

async getWeatherData(zip: string, scale: TempScale): Promise<ProcessedResponse> {
    try {
      const response = await axios.get<RawResponse>(this.baseUrl, {
        params: {
          key: this.apiKey,
          q: zip,
        }
      });

      const { temp_c, temp_f } = response.data.current;
      
      const temperature = scale === 'Celsius' ? temp_c : temp_f;
      
      return {
        temperature,
        scale 
      };

    } catch (error: unknown) {
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<WeatherAPIError>;
        
        // 1006 is the specific WeatherAPI code if no location is found
        if (axiosError.response?.data?.error?.code === 1006) {
          throw new Error('NOT_FOUND');
        }
      }
      throw new Error('API_UNAVAILABLE'); // For any other errors, we assume the API is unavailable.
    }
  }
}