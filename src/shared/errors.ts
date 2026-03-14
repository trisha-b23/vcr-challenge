import { ServerResponse } from 'http';

export class ErrorHandler {
  static handleError(res: ServerResponse, error: unknown) {
    let statusCode = 500;
    let message = 'An internal server error occurred';

    if (error instanceof Error) {
      const errorMap: Record<string, { code: number; msg: string }> = {
        'MISSING_LOCATION': { code: 400, msg: 'A location is required' },
        'INVALID_FORMAT': { code: 400, msg: 'A valid zip code is required. Please enter a US, UK, or Canada location code.' },
        'INVALID_SCALE': { code: 400, msg: 'Invalid scale. Use "Celsius" or "Fahrenheit"' },
        'NOT_FOUND': { code: 404, msg: 'Location is not found. Please check the code and try again.' },
        'API_UNAVAILABLE': { code: 503, msg: 'The Weather API is temporarily unavailable.' }
      };

      const mapped = errorMap[error.message];
      if (mapped) {
        statusCode = mapped.code;
        message = mapped.msg;
      }
    }

    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: message }));
  }

  static sendJSON(res: ServerResponse, statusCode: number, data: object) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }
}