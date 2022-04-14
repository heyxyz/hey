import { Community } from '@generated/lenstertypes'
import React, { FC } from 'react'

interface Props {
  community: Community
}

const Settings: FC<Props> = ({ community }) => {
  return <div className="p-5">Hi</div>
}

export default Settings
