import { Trans } from '@lingui/macro';
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
      <div className="inline-flex max-w-screen-xl items-start justify-start gap-2 rounded-xl border border-neutral-400 bg-neutral-50 px-2.5 py-4 shadow dark:border-neutral-500 dark:bg-neutral-800">
        <div className="relative h-5 w-5"> {Icons.infocircle} </div>
        <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-4">
          <div className="flex flex-col items-start justify-start gap-1">
            <div className="text-sm font-semibold leading-tight text-neutral-600 dark:text-neutral-200">
              <Trans>{title}</Trans>
            </div>
            <div className="text-sm font-normal leading-tight text-neutral-500 dark:text-neutral-300">
              <Trans>{description}</Trans>
            </div>
          </div>
          <div className="inline-flex items-start justify-start gap-2">
            <button
              className="flex items-center justify-center gap-2 rounded-md border border-violet-500 bg-violet-500 px-2 py-1 text-sm text-neutral-50"
              onClick={onAccept}
            >
              <Trans>Accept</Trans>
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-md border border-red-300 bg-red-400 bg-opacity-20 px-2 py-1 text-sm text-red-400"
              onClick={onClose}
            >
              <Trans>Deny</Trans>
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
