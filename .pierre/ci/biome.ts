import { run } from "pierre";

export const label = "Biome Lint";

export default async () => {
  await run("pnpm biome:check", {
    label: "Checking Biome Lint"
  });
};
