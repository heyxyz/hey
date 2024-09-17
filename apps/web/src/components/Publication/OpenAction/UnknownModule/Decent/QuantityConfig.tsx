import type { FC } from "react";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";

import { useNftOpenActionStore } from "./FeedEmbed";

const QuantityConfig: FC = () => {
  const { selectedQuantity, setSelectedQuantity } = useNftOpenActionStore();

  return (
    <div className="flex items-center justify-between border-zinc-200 border-y px-5 py-4">
      <p className="ld-text-gray-500">Quantity</p>
      <div className="flex items-center space-x-4">
        <button
          className="flex size-6 items-center justify-center rounded-full bg-gray-200 disabled:opacity-50"
          disabled={selectedQuantity === 1}
          onClick={(e) => {
            stopEventPropagation(e);
            setSelectedQuantity(selectedQuantity - 1);
          }}
          type="button"
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
          type="button"
        >
          <PlusIcon className="size-3 stroke-black text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default QuantityConfig;
