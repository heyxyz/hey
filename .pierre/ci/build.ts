import { run } from "pierre";

export const label = "Run Production Build";

export default async () => {
  await run("pnpm build");
};
