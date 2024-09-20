import { run } from "pierre";

export const label = "Run Biome Linter";

export default async () => {
  await run("pnpm biome:check");
};
