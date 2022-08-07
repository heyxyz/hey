import NewComment from '@components/Comment/NewComment'
import SinglePublication from '@components/Publication/SinglePublication'
import { Card } from '@components/UI/Card'
import { Modal } from '@components/UI/Modal'
import { PencilAltIcon } from '@heroicons/react/outline'
import { Mixpanel } from '@lib/mixpanel'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { usePublicationStore } from 'src/store/publication'
import { PUBLICATION } from 'src/tracking'

import NewPost from '..'

const NewPostModal: FC = () => {
  const { query, isReady } = useRouter()
  const showNewPostModal = usePublicationStore(
    (state) => state.showNewPostModal
  )
  const setShowNewPostModal = usePublicationStore(
    (state) => state.setShowNewPostModal
  )
  const setPublicationContent = usePublicationStore(
    (state) => state.setPublicationContent
  )
  const setPreviewPublication = usePublicationStore(
    (state) => state.setPreviewPublication
  )
  const parentPub = usePublicationStore((state) => state.parentPub)
  const setParentPub = usePublicationStore((state) => state.setParentPub)

  useEffect(() => {
    if (isReady && query.text) {
      const { text, url, via, hashtags, preview } = query
      let processedHashtags

      if (hashtags) {
        processedHashtags = (hashtags as string)
          .split(',')
          .map((tag) => `#${tag} `)
          .join('')
      }

      setShowNewPostModal(true)
      setPublicationContent(
        `${text}${processedHashtags ? ` ${processedHashtags} ` : ''}${
          url ? `\n\n${url}` : ''
        }${via ? `\n\nvia @${via}` : ''}`
      )
      setPreviewPublication(preview ? true : false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <button
        type="button"
        className="flex items-start"
        onClick={() => {
          setParentPub(null)
          setShowNewPostModal(!showNewPostModal)
          Mixpanel.track(PUBLICATION.OPEN_NEW)
        }}
      >
        <PencilAltIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <Modal
        title="New Post"
        icon={<PencilAltIcon className="w-5 h-5 text-brand" />}
        size="md"
        show={showNewPostModal}
        onClose={() => setShowNewPostModal(false)}
      >
        {parentPub ? (
          <>
            <Card className="mx-5 mt-5">
              <SinglePublication
                publication={parentPub}
                showType={false}
                showActions={false}
              />
            </Card>
            <NewComment
              setShowModal={setShowNewPostModal}
              hideCard
              publication={parentPub}
              type="comment"
            />
          </>
        ) : (
          <NewPost setShowModal={setShowNewPostModal} hideCard />
        )}
      </Modal>
    </>
  )
}

export default NewPostModal
