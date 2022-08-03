import { LensterPublication } from '@generated/lenstertypes'
import { Menu } from '@headlessui/react'
import { CodeIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import React, { FC } from 'react'

interface Props {
  post: LensterPublication
}

const Embed: FC<Props> = ({ post }) => {
  return (
    <Menu.Item
      as="a"
      className={({ active }: { active: boolean }) =>
        clsx(
          { 'dropdown-active': active },
          'block px-4 py-1.5 text-sm m-2 rounded-lg cursor-pointer'
        )
      }
      href={`https://embed.withlens.app/?url=${post?.id ?? post?.pubId}`}
      target="_blank"
    >
      <div className="flex items-center space-x-2">
        <CodeIcon className="w-4 h-4" />
        <div>Embed</div>
      </div>
    </Menu.Item>
  )
}

export default Embed
