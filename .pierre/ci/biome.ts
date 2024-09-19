import { run } from "pierre";

export default async () => {
  await run("pnpm biome:check", {
    label: "Run Biome Linter"
  });
};
