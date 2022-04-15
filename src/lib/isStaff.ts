import { staffs } from 'data/staffs'

const isStaff = (id: string): boolean => staffs.includes(id)

export default isStaff
