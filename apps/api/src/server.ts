import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import { router } from 'express-file-routing';
import ViteExpress from 'vite-express';

dotenv.config({ override: true });

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(cors());

// Begin: Configure CORS
const corsOptions: cors.CorsOptions = {
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
app.use(cors(corsOptions));
// End: Configure CORS

(async () => {
  app.use('/', await router());

  ViteExpress.listen(app, 4784, () =>
    console.log('Server is listening on port 4784...')
  );
})();
