import { describe, it, expect } from 'vitest';
import { RequestValidator } from '../src/weather/weather.validation.js';

describe('RequestValidator', () => {
    describe('location validation', () => {
    
        it('should throw MISSING_LOCATION if no location provided', () => {
            expect(() => RequestValidator.validateWeatherParams('', null))
            .toThrow('MISSING_LOCATION');
        });

        it('should throw MISSING_LOCATION if location is only whitespace', () => {
            expect(() => RequestValidator.validateWeatherParams('   ', null))
            .toThrow('MISSING_LOCATION');
        });

        it('should throw MISSING_LOCATION if location is undefined', () => {
            expect(() => RequestValidator.validateWeatherParams(undefined, null))
            .toThrow('MISSING_LOCATION');
        });
        
        it('should accept a valid US zip code', () => {
            const result = RequestValidator.validateWeatherParams('24060', null);
            expect(result.zipCode).toBe('24060');
        });

        it('should accept a valid UK postcode', () => {
            const result = RequestValidator.validateWeatherParams('SW1A 1AA', null);
            expect(result.zipCode).toBe('SW1A 1AA');
        });

        it('should accept a valid UK postcode (lowercase characters)', () => {
            const result = RequestValidator.validateWeatherParams('sw1', null);
            expect(result.zipCode).toBe('sw1');
        });

        it('should accept a valid Canadian postal code', () => {
            const result = RequestValidator.validateWeatherParams('K1A 0A6', null);
            expect(result.zipCode).toBe('K1A 0A6');
        });

        it('should accept a valid Canadian postal code (lowercase characters)', () => {
            const result = RequestValidator.validateWeatherParams('k1a', null);
            expect(result.zipCode).toBe('k1a');
        });

        it('should throw INVALID_FORMAT if format is unrecognized', () => {
            expect(() => RequestValidator.validateWeatherParams('a@s24', null))
            .toThrow('INVALID_FORMAT');
        });
    });

    describe('scale validation', () => {
        it('should default to Fahrenheit if no scale provided', () => {
            const result = RequestValidator.validateWeatherParams('24060', null);
            expect(result.scale).toBe('Fahrenheit');
        });

        it('should accept Celsius', () => {
            const result = RequestValidator.validateWeatherParams('24060', 'Celsius');
            expect(result.scale).toBe('Celsius');
        });

        it('should accept Fahrenheit', () => {
            const result = RequestValidator.validateWeatherParams('24060', 'Fahrenheit');
            expect(result.scale).toBe('Fahrenheit');
        });

        it('should throw INVALID_SCALE for invalid scale', () => {
            expect(() => RequestValidator.validateWeatherParams('24060', 'Kelvin'))
            .toThrow('INVALID_SCALE');
        });
    });
});