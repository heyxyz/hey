import { run } from "pierre";

export const label = "Typecheck";

export default async () => {
  await run("pnpm typecheck");
};
