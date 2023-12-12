import type cors from "cors";

const corsConfig: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      /^https:\/\/(\w+\.)?hey\.xyz$/.test(origin) || // https://hey.xyz and https://*.hey.xyz
      /^https:\/\/\w+-heyxyz\.vercel\.app$/.test(origin) || // https://*-heyxyz.vercel.app
      origin === "http://localhost:4783"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

export default corsConfig;
