import { misused } from "@hey/data/misused";

/**
 * Checks whether a profile is scam or not.
 *
 * @param id The profile id to check.
 * @returns True if the profile is scam, false otherwise.
 */
const hasMisused = (id: string): boolean => misused.some((s) => s.id === id);

export default hasMisused;
