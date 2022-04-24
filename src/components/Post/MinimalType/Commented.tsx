import { LensterPost } from '@generated/lenstertypes'
import { useTheme } from 'next-themes'
import React, { FC } from 'react'

interface Props {
  post: LensterPost
}

const Commented: FC<Props> = ({ post }) => {
  const { resolvedTheme } = useTheme()
  const commentOn: LensterPost | any = post?.commentOn

  return <div className="flex items-end w-3/5"></div>
}

export default Commented
