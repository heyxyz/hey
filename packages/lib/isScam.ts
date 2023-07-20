import { scam } from '@lenster/data/scam';

/**
 * Checks whether a profile is scam or not.
 *
 * @param id The profile id to check.
 * @returns True if the profile is scam, false otherwise.
 */
const isScam = (id: string): boolean => scam.some((s) => s.id === id);

export default isScam;
