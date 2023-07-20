import { scam } from '@lenster/data/scam';

/**
 * Get scam details.
 *
 * @param id The profile id to get.
 * @returns the scam object.
 */
const getScamDetails = (
  id: string
): {
  id: string;
  identifiedOn: string | null;
  description: string | null;
} | null => {
  const scamDetails = scam.find((s) => s.id === id);

  return scamDetails || null;
};

export default getScamDetails;
