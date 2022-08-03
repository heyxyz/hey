import { gql, useMutation } from '@apollo/client'
import { LensterPost } from '@generated/lenstertypes'
import { Menu } from '@headlessui/react'
import { TrashIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

export const HIDE_POST_MUTATION = gql`
  mutation HidePublication($request: HidePublicationRequest!) {
    hidePublication(request: $request)
  }
`

interface Props {
  post: LensterPost
}

const Delete: FC<Props> = ({ post }) => {
  const { pathname, push } = useRouter()
  const [hidePost] = useMutation(HIDE_POST_MUTATION, {
    onCompleted() {
      pathname === '/posts/[id]' ? push('/') : location.reload()
    }
  })

  return (
    <Menu.Item
      as="div"
      className={({ active }: { active: boolean }) =>
        clsx(
          { 'dropdown-active': active },
          'block px-4 py-1.5 text-sm text-red-500 m-2 rounded-lg cursor-pointer'
        )
      }
      onClick={() => {
        if (confirm('Are you sure you want to delete?')) {
          hidePost({ variables: { request: { publicationId: post?.id } } })
        }
      }}
    >
      <div className="flex items-center space-x-2">
        <TrashIcon className="w-4 h-4" />
        <div>Delete</div>
      </div>
    </Menu.Item>
  )
}

export default Delete
