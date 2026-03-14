// Provides the information from the Raw API response that we care about
export interface RawResponse {
  // Though the location won't be used in the processed response, it is included here to
  // help with testing purposes. It allows us to confirm whether the API response is being 
  // correctly parsed and that we are accessing the right data.
    location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
  };
}

// The data we will send back to the client after processing the API response
export interface ProcessedResponse {
  temperature: number;
  scale: string;
}

// Enum to define the allowed temperature scales.
export type TempScale = 'Fahrenheit' | 'Celsius';

// Structure of error response received from the WeatherAPI
export interface WeatherAPIError {
  error: {
    code: number;
    message: string;
  };
}