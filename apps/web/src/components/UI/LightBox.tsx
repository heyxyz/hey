import { Dialog, Transition } from '@headlessui/react';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { Fragment } from 'react';

interface Props {
  show: boolean;
  url: string | null;
  onClose: () => void;
}

export const LightBox: FC<Props> = ({ show, url, onClose }) => {
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
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
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true" />
          <Transition.Child
            as="div"
            className="inline-block transform p-8 text-left align-middle transition-all sm:max-w-3xl"
            enter="ease-out duration-100"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <img
              className="max-h-screen"
              height={1000}
              width={1000}
              src={url ?? ''}
              alt={url ?? ''}
              onClick={onClose}
            />
            {url ? (
              <div className="mt-1">
                <a
                  className="text-sm text-gray-200 hover:underline"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Trans>Open original</Trans>
                </a>
              </div>
            ) : null}
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
