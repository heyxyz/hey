import { run } from "pierre";

export default async () => {
  await run("pnpm install --frozen-lockfile", {
    label: "Install Dependencies"
  });

  await run("pnpm biome:check", {
    label: "Run Biome Linter"
  });
};
