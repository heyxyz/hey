import type { MisuseType } from '@lenster/data/misused';
import { misused } from '@lenster/data/misused';

/**
 * Get misused details.
 *
 * @param id The profile id to get.
 * @returns the misused object.
 */
const getMisuseDetails = (
  id: string
): {
  id: string;
  type: MisuseType;
  identifiedOn: string | null;
  description: string | null;
} | null => {
  const misusedDetails = misused.find((s) => s.id === id);

  return misusedDetails || null;
};

export default getMisuseDetails;
