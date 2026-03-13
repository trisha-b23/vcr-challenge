import type { TempScale } from './weather.dto.js';

export interface ValidatedRequest {
  zipCode: string;
  scale: TempScale;
}

export class RequestValidator {
  static validateWeatherParams(zipCode: string | undefined, rawScale: string | null): ValidatedRequest {
    // Validate zip
    // If no zip code is provided, throw an error
    // trim() is used to catch cases where the user simply typed in whitespaces
    if (!zipCode || zipCode.trim().length === 0) {
      throw new Error('MISSING_LOCATION');
    }
    
    zipCode = zipCode.trim(); // in case the user accidentally included leading/trailing whitespace

    // The WeatherAPI accepts three location formats, US Zip codes, UK postcodes, and Canadian postal codes.
    const isUSZip = /^\d{5}$/.test(zipCode);
    const isUKCode = /^[A-Z]{1,2}\d[A-Z\d]?(\s?\d[A-Z]{2})?$/i.test(zipCode);
    const isCACode = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(zipCode);

    // If the zip code doesn't match any of the accepted formats, throw an error
    if (!isUSZip && !isUKCode && !isCACode) {
      throw new Error('INVALID_FORMAT');
    }

    // Validate temperature scale
    const scale = rawScale || 'Fahrenheit';
    if (!this.isValidScale(scale)) {
      throw new Error('INVALID_SCALE');
    }

    return { zipCode, scale };
  }

  private static isValidScale(scale: string): scale is TempScale {
    return ['Celsius', 'Fahrenheit'].includes(scale);
  }
}