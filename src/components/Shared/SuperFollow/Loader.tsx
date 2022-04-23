import { Spinner } from '@components/UI/Spinner'
import { FC } from 'react'

const FollowModuleLoader: FC = () => {
  return (
    <div className="p-5 space-y-2 font-bold text-center">
      <Spinner size="md" className="mx-auto" />
      <div>Loading super follow</div>
    </div>
  )
}

export default FollowModuleLoader
