import { useMutation } from '@apollo/client'
import { HIDE_POST_MUTATION } from '@components/Post/Actions/Menu/Delete'
import { Button } from '@components/UI/Button'
import { Community } from '@generated/lenstertypes'
import { TrashIcon } from '@heroicons/react/outline'
import trackEvent from '@lib/trackEvent'
import React, { FC } from 'react'

interface Props {
  community: Community
}

const Settings: FC<Props> = ({ community }) => {
  const [hidePost] = useMutation(HIDE_POST_MUTATION, {
    onCompleted() {
      trackEvent('delete community')
    }
  })

  return (
    <div className="p-5">
      <div>
        <Button
          icon={<TrashIcon className="h-5 w-5" />}
          variant="danger"
          onClick={() => {
            if (confirm('Are you sure you want to delete?')) {
              hidePost({
                variables: { request: { publicationId: community?.id } }
              })
            }
          }}
        >
          Delete Community
        </Button>
      </div>
    </div>
  )
}

export default Settings
