import { run } from "pierre";

export default async () => {
  await run("pnpm typecheck", {
    label: "Run Typecheck"
  });
};
