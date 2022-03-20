import { Comment, Mirror, Post } from './types'

export type LensHubPost = Post & Mirror & Comment & { pubId: string }
