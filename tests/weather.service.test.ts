import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios, { AxiosError }  from 'axios';
import { WeatherService } from '../src/weather/weather.service.js';

vi.spyOn(axios, 'get');

describe('WeatherService', () => {
    let service: WeatherService;

    beforeEach(() => {
        service = new WeatherService();
    });

    it('should return temperature in Fahrenheit', async () => {
        vi.spyOn(axios, 'get').mockResolvedValueOnce({
        data: {
            location: { name: 'Blacksburg', region: 'Virginia', country: 'USA' },
            current: { temp_c: 10, temp_f: 50 }
        }
        });

        const result = await service.getWeatherData('24060', 'Fahrenheit');
        expect(result).toEqual({ temperature: 50, scale: 'Fahrenheit' });
    });

    it('should return temperature in Celsius', async () => {
        vi.spyOn(axios, 'get').mockResolvedValueOnce({
        data: {
            location: { name: 'Blacksburg', region: 'Virginia', country: 'USA' },
            current: { temp_c: 10, temp_f: 50 }
        }
        });

        const result = await service.getWeatherData('24060', 'Celsius');
        expect(result).toEqual({ temperature: 10, scale: 'Celsius' });
    });

    it('should throw NOT_FOUND if no location corresponds to the zip code', async () => {
        const axiosError = new AxiosError();
        axiosError.response = {
            data: { error: { code: 1006 } },
            status: 400,
            statusText: 'Bad Request',
            headers: {},
            config: { headers: {} } as any
        };

        vi.spyOn(axios, 'get').mockRejectedValueOnce(axiosError);

        await expect(service.getWeatherData('00000', 'Fahrenheit'))
            .rejects.toThrow('NOT_FOUND');
    });

    it('should throw API_UNAVAILABLE for other errors', async () => {
        vi.spyOn(axios, 'get').mockRejectedValueOnce(new Error('Connection Error'));

        await expect(service.getWeatherData('24060', 'Fahrenheit'))
        .rejects.toThrow('API_UNAVAILABLE');
    });
});