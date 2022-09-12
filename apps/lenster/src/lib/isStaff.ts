import { mainnetStaffs, testnetStaffs } from 'data/staffs';
import { IS_MAINNET } from 'src/constants';

/**
 *
 * @param id - Profile id
 * @returns is staff or not
 */
const isStaff = (id: string): boolean =>
  IS_MAINNET ? mainnetStaffs.includes(id) : testnetStaffs.includes(id);

export default isStaff;
