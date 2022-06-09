import React, { FC } from 'react'

interface Props {
  og: any
}

const Player: FC<Props> = ({ og }) => {
  return (
    <div className="mt-4 text-sm w-5/6">
      <div
        className="iframely-player"
        dangerouslySetInnerHTML={{ __html: og.html }}
      />
    </div>
  )
}

export default Player
