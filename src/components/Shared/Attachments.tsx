import { Button } from '@components/UI/Button'
import { TrashIcon } from '@heroicons/react/outline'
import React from 'react'

const getGridRows = (attachments: number) => {
  if (attachments > 2) {
    return 'grid grid-flow-col grid-cols-2 grid-rows-2 gap-2 pt-3'
  } else {
    return 'grid grid-flow-col grid-cols-2 grid-rows1 gap-2 pt-3'
  }
}

interface Props {
  attachments: any
  setAttachments?: any
  isNew?: boolean
}

const Attachments: React.FC<Props> = ({
  attachments,
  setAttachments,
  isNew = false
}) => {
  const removeAttachment = (attachment: any) => {
    const arr = attachments
    setAttachments(
      arr.filter(function (ele: any) {
        return ele != attachment
      })
    )
  }

  return (
    <>
      {attachments?.length !== 0 && (
        <div className={getGridRows(attachments?.length)}>
          {attachments?.map((attachment: any) => (
            <div
              className="aspect-w-16 aspect-h-12"
              key={isNew ? attachment.item : attachment.original.url}
            >
              {(isNew ? attachment.type : attachment.original.mimeType) ===
              'video/mp4' ? (
                <video
                  controls
                  className="object-cover bg-gray-100 border rounded-lg dark:bg-gray-800 dark:border-gray-800"
                >
                  <source
                    src={isNew ? attachment.item : attachment.original.url}
                    type="video/mp4"
                  />
                </video>
              ) : (
                <img
                  className="object-cover bg-gray-100 border rounded-lg dark:bg-gray-800 dark:border-gray-800"
                  src={isNew ? attachment.item : attachment.original.url}
                  alt={isNew ? attachment.item : attachment.original.url}
                />
              )}
              {isNew && (
                <div className="m-3">
                  <Button
                    variant="danger"
                    icon={<TrashIcon className="w-4 h-4" />}
                    onClick={() => removeAttachment(attachment)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default Attachments
