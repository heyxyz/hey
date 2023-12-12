import type cors from 'cors';

class CorsError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const corsConfig: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      /^https:\/\/(\w+\.)?hey\.xyz$/.test(origin) || // https://hey.xyz and https://*.hey.xyz
      /^https:\/\/\w+-heyxyz\.vercel\.app$/.test(origin) || // https://*-heyxyz.vercel.app
      origin === 'http://localhost:4783'
    ) {
      callback(null, true);
    } else {
      const errorMessage = 'Not allowed by CORS. Check the allowed origins: https://hey.xyz, https://*.hey.xyz, https://*-heyxyz.vercel.app, http://localhost:4783';

      // Using the custom CorsError class
      const errorResponse = new CorsError(errorMessage, 403);

      callback(errorResponse);

    }
  }
};

export default corsConfig;
