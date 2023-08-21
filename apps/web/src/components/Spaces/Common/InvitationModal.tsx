import type { FC } from 'react';

import { Icons } from './assets/Icons';

interface InvitationModalProps {
  title: string;
  description: string;
  onAccept: () => void;
  onClose: () => void;
}

const InvitationModal: FC<InvitationModalProps> = ({
  title,
  description,
  onAccept,
  onClose
}) => {
  return (
    <div className="fixed z-30 flex items-center justify-center px-2 py-2">
      <div className="inline-flex max-w-screen-xl items-start justify-start gap-2 rounded-xl border border-neutral-500 bg-neutral-800 px-2.5 py-4 shadow">
        <div className="relative h-5 w-5"> {Icons.infocircle} </div>
        <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-4">
          <div className="flex flex-col items-start justify-start gap-1">
            <div className="text-sm font-semibold leading-tight text-neutral-200">
              {title}
            </div>
            <div className="text-sm font-normal leading-tight text-neutral-300">
              {description}
            </div>
          </div>
          <div className="inline-flex items-start justify-start gap-2">
            <button
              className="flex items-center justify-center gap-2 rounded-md border border-violet-500 bg-violet-500 px-2 py-1 text-sm"
              onClick={onAccept}
            >
              Accept
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-md border border-red-300 bg-red-400 bg-opacity-20 px-2 py-1 text-sm"
              onClick={onClose}
            >
              Deny
            </button>
          </div>
        </div>
        <div className="flex h-5 w-5 items-center justify-center">
          <button
            className="inline-flex shrink grow basis-0 items-center justify-center self-stretch rounded-lg p-2"
            onClick={() => {
              onClose();
            }}
          >
            <div className="relative flex h-5 w-5 flex-col items-start justify-start">
              {Icons.cross}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
export default InvitationModal;
