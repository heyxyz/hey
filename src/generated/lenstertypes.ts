import { Comment, Mirror, Post } from './types'

export type LensterPost = Post & Mirror & Comment & { pubId: string }
