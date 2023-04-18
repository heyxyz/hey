import { SUPER_STAFF_ADDRESSES } from 'src/constants';

const isSuperStaff = (address: string) => {
  return SUPER_STAFF_ADDRESSES.includes(address);
};

export default isSuperStaff;
