import type { FC } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import Link from 'next/link';
import { Fragment } from 'react';

interface LightBoxProps {
  onClose: () => void;
  show: boolean;
  url: null | string;
}

export const LightBox: FC<LightBoxProps> = ({ onClose, show, url }) => {
  return (
    <Transition.Root as={Fragment} show={show}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500/75 transition-opacity" />
          </Transition.Child>
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" />
          <Transition.Child
            as="div"
            className="inline-block p-8 text-left align-middle transition-all sm:max-w-3xl"
            enter="ease-out duration-100"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <img
              alt={url || ''}
              className="max-h-screen"
              height={1000}
              onClick={onClose}
              src={url || ''}
              width={1000}
            />
            {url ? (
              <div className="mt-1">
                <Link
                  className="text-sm text-gray-200 hover:underline"
                  href={url}
                  onClick={stopEventPropagation}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  Open original
                </Link>
              </div>
            ) : null}
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
