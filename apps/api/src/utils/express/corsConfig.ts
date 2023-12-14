import type cors from 'cors';

const corsConfig: cors.CorsOptions = {
  origin: ['hey.xyz', /\.hey\.xyz$/, /-heyxyz\.vercel\.app$/]
};

export default corsConfig;
