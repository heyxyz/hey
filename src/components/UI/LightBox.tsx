import { Dialog, Transition } from '@headlessui/react';
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
      <Dialog as="div" className="overflow-y-auto fixed inset-0 z-10" onClose={onClose}>
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
            className="sm:max-w-3xl inline-block transform transition-all align-middle"
            enter="ease-out duration-100"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <img className="max-h-screen p-8" src={url ?? ''} alt={url ?? ''} onClick={onClose} />
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
