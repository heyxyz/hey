import type cors from 'cors';

const corsConfig: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      origin.includes('hey.xyz') ||
      origin.includes('heyxyz.vercel.app') ||
      origin.startsWith('http://localhost')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

export default corsConfig;
