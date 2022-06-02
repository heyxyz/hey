import { LensterPost } from '@generated/lenstertypes'
import { Menu } from '@headlessui/react'
import clsx from 'clsx'
import { useTheme } from 'next-themes'
import React, { FC } from 'react'
import { STATIC_ASSETS } from 'src/constants'

interface Props {
  post: LensterPost
}

const Tweet: FC<Props> = ({ post }) => {
  const { resolvedTheme } = useTheme()
  return (
    <Menu.Item
      as="a"
      className={({ active }: { active: boolean }) =>
        clsx(
          { 'dropdown-active': active },
          'block px-4 py-1.5 text-sm m-2 rounded-lg cursor-pointer'
        )
      }
      href={`https://twitter.com/intent/tweet?text=https://lenster.xyz/posts/${
        post?.id ?? post?.pubId
      }`}
      target="_blank"
    >
      <div className="flex items-center space-x-2">
        {resolvedTheme === 'dark' ? (
          <img
            src={`${STATIC_ASSETS}/brands/twitter-light.svg`}
            className="w-4 h-4"
            height={16}
            width={16}
            alt="Twitter Logo"
          />
        ) : (
          <img
            src={`${STATIC_ASSETS}/brands/twitter-dark.svg`}
            className="w-4 h-4"
            height={16}
            width={16}
            alt="Twitter Logo"
          />
        )}
        <div>Tweet</div>
      </div>
    </Menu.Item>
  )
}

export default Tweet
