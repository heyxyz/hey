import NewPostShimmer from '@components/Shared/Shimmer/NewPostShimmer'
import { Modal } from '@components/UI/Modal'
import { PencilAltIcon } from '@heroicons/react/outline'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const NewPost = dynamic(() => import('..'), {
  loading: () => <NewPostShimmer />
})

const NewPostModal: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <>
      <button
        className="flex items-start"
        onClick={() => setShowModal(!showModal)}
      >
        <PencilAltIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <Modal
        title="New Post"
        icon={<PencilAltIcon className="h-5 w-5 text-brand-500" />}
        size="md"
        show={showModal}
        onClose={() => setShowModal(!showModal)}
      >
        <NewPost hideCard />
      </Modal>
    </>
  )
}

export default NewPostModal
