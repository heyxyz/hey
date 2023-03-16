import { IS_MAINNET } from 'data/constants';
import { mainnetStaffs, testnetStaffs } from 'data/staffs';

/**
 *
 * @param id - Profile id
 * @returns is staff or not
 */
const isStaff = (id: string): boolean =>
  IS_MAINNET ? mainnetStaffs.includes(id) : testnetStaffs.includes(id);

export default isStaff;
