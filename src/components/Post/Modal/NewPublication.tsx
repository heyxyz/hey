import { Modal } from '@components/UI/Modal'
import { PencilAltIcon, PlusCircleIcon } from '@heroicons/react/outline'
import { useState } from 'react'

import NewPost from '../NewPost'

const NewPublication: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <>
      <button
        className="flex items-start"
        onClick={() => setShowModal(!showModal)}
      >
        <PlusCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
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

export default NewPublication
