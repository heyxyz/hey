import { LensterCollectModule } from '@generated/lenstertypes'
import getUniswapURL from '@lib/getUniswapURL'
import React, { FC } from 'react'

interface Props {
  collectModule: LensterCollectModule
}

const Uniswap: FC<Props> = ({ collectModule }) => {
  return (
    <div className="space-y-1">
      <div className="text-sm">
        You don't have enough <b>{collectModule?.amount?.asset?.symbol}</b>
      </div>
      <a
        href={getUniswapURL(
          parseFloat(collectModule?.amount?.value),
          collectModule?.amount?.asset?.address
        )}
        className="flex items-center space-x-1.5 text-xs font-bold text-pink-500 float-left sm:float-right"
        target="_blank"
        rel="noreferrer noopener"
      >
        <img
          src="https://assets.lenster.xyz/images/brands/uniswap.png"
          className="h-5 w-5"
          height={20}
          width={20}
          alt="Uniswap"
        />
        <div>Swap in Uniswap</div>
      </a>
    </div>
  )
}

export default Uniswap
