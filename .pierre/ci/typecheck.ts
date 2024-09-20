import { run } from "pierre";

export const label = "Run Typecheck";

export default async () => {
  await run("pnpm typecheck");
};
