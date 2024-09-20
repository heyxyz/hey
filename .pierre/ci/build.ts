import { run } from "pierre";

export const label = "Run Build";

export default async () => {
  await run("pnpm build");
};
