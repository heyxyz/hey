import { IS_MAINNET } from 'data/constants';
import { mainnetStaffs, testnetStaffs } from 'data/staffs';

/**
 * Checks if a given profile ID belongs to a staff member.
 *
 * @param id The profile ID to check.
 * @returns True if the profile ID belongs to a staff member, `false` otherwise.
 */
const isStaff = (id: string): boolean =>
  IS_MAINNET ? mainnetStaffs.includes(id) : testnetStaffs.includes(id);

export default isStaff;
