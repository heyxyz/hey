import 'tippy.js/dist/tippy.css'

import { QuestionMarkCircleIcon } from '@heroicons/react/solid'
import Tippy from '@tippyjs/react'
import React, { FC, ReactNode } from 'react'

interface Props {
  content: ReactNode
}

export const HelpTooltip: FC<Props> = ({ content }) => {
  if (!content) return null

  return (
    <Tippy
      placement="top"
      duration={0}
      className="p-2 tracking-wide !rounded-xl !leading-5 !bg-gray-800"
      content={<span>{content}</span>}
    >
      <QuestionMarkCircleIcon className="h-[17px] w-[17px] text-gray-500" />
    </Tippy>
  )
}
