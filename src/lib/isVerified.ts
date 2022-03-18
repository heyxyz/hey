import { verified } from 'data/verified'

export const isVerified = (handle: string) => verified.includes(handle)
