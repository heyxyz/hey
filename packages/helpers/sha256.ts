import { createHash } from "node:crypto";

const sha256 = (text: string): string => {
  return createHash("sha256").update(text).digest("hex");
};

export default sha256;
