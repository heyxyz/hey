import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { Fragment } from 'react';

interface ModalProps {
  icon?: ReactNode;
  title?: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'fit-content';
  show: boolean;
  children: ReactNode[] | ReactNode;
  dataTestId?: string;
  onClose?: () => void;
}

export const Modal: FC<ModalProps> = ({
  icon,
  title,
  size = 'sm',
  show,
  children,
  dataTestId = '',
  onClose
}) => {
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="border-red fixed inset-2 z-10 overflow-y-auto border-2"
        onClose={() => onClose?.()}
        data-testid={dataTestId}
      >
        <div className="flex min-h-screen items-center justify-center p-4 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-900 dark:bg-opacity-80" />
          </Transition.Child>
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true" />
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={clsx(
                { 'sm:max-w-5xl': size === 'lg' },
                { 'sm:max-w-3xl': size === 'md' },
                { 'sm:max-w-lg': size === 'sm' },
                { 'sm:max-w-sm': size === 'xs' },
                'inline-block w-full transform rounded-[2px] bg-white text-left align-bottom shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:align-middle'
              )}
            >
              {title && (
                <div className="divider flex items-center justify-between px-5 py-3.5 dark:bg-black">
                  <div className="flex items-center space-x-2 font-bold">
                    {icon}
                    <div className="text-dark font-medium uppercase dark:text-white">{title}</div>
                  </div>
                  {onClose ? (
                    <button
                      type="button"
                      className="dark:hover:bg-brand-500 hover:bg-brand-500 rounded-full p-1 text-gray-800 dark:text-gray-100"
                      onClick={onClose}
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  ) : null}
                </div>
              )}
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
