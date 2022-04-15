import { verified } from 'data/verified'

const isVerified = (id: string): boolean => verified.includes(id)

export default isVerified
