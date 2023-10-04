require("dotenv").config();
const esbuild = require("esbuild");
const { getFilesInDirectory } = require("./utils");

const STATIC_ASSETS = getFilesInDirectory("public/");

const outfile =
  !!process.env.NEXT_PUBLIC_IS_PRODUCTION
    ? ".vercel/output/static/service-worker.js" // this vary based deployment environment
    : "public/service-worker.js";

esbuild
  .build({
    target: "es2020",
    platform: "browser",
    entryPoints: ["./src/service-worker/index.ts"],
    outfile,
    allowOverwrite: true,
    format: "esm",
    bundle: true,
    define: {
      "process.env.STATIC_ASSETS": JSON.stringify(STATIC_ASSETS),
    },
    minify: true,
  })
  .then(() => {});
