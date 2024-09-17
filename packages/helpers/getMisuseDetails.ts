import type { MisuseType } from "@hey/data/misused";

import { misused } from "@hey/data/misused";

/**
 * Get misused details.
 *
 * @param id The profile id to get.
 * @returns the misused object.
 */
const getMisuseDetails = (
  id: string
): {
  description: null | string;
  id: string;
  identifiedOn: null | string;
  type: MisuseType;
} | null => {
  const misusedDetails = misused.find((s) => s.id === id);

  return misusedDetails || null;
};

export default getMisuseDetails;
