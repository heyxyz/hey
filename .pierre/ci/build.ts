import { run } from "pierre";

export const label = "Production Build";

export default async () => {
  await run("pnpm build");
};
