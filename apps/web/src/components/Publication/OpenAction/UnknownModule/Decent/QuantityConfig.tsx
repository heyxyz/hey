import type { FC } from 'react';

import stopEventPropagation from '@good/helpers/stopEventPropagation';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

import { useNftOpenActionStore } from './FeedEmbed';

const QuantityConfig: FC = () => {
  const { selectedQuantity, setSelectedQuantity } = useNftOpenActionStore();

  return (
    <div className="flex items-center justify-between border-y border-zinc-200 px-5 py-4">
      <p className="ld-text-gray-500">Quantity</p>
      <div className="flex items-center space-x-4">
        <button
          className="flex size-6 items-center justify-center rounded-full bg-gray-200 disabled:opacity-50"
          disabled={selectedQuantity === 1}
          onClick={(e) => {
            stopEventPropagation(e);
            setSelectedQuantity(selectedQuantity - 1);
          }}
        >
          <MinusIcon className="size-3 stroke-black text-gray-600" />
        </button>
        <span className="size-6 text-center">{selectedQuantity}</span>
        <button
          className="flex size-6 items-center justify-center rounded-full bg-gray-200 disabled:opacity-40"
          onClick={(e) => {
            stopEventPropagation(e);
            setSelectedQuantity(selectedQuantity + 1);
          }}
        >
          <PlusIcon className="size-3 stroke-black text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default QuantityConfig;
