import type { FC, ReactNode } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import { Button } from './Button';

interface AlertProps {
  cancelText?: string;
  children?: ReactNode;
  confirmText?: string;
  description: ReactNode;
  isDestructive?: boolean;
  isPerformingAction?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  show: boolean;
  title: ReactNode;
}

export const Alert: FC<AlertProps> = ({
  cancelText = 'Cancel',
  children,
  confirmText,
  description,
  isDestructive = false,
  isPerformingAction = false,
  onClose,
  onConfirm,
  show,
  title
}) => {
  return (
    <Transition.Root as={Fragment} show={show}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => onClose?.()}
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
            <Dialog.Overlay className="fixed inset-0 bg-gray-500/75 transition-opacity dark:bg-gray-900/80" />
          </Transition.Child>
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" />
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block w-full scale-100 space-y-6 rounded-xl bg-white p-5 text-left align-bottom shadow-xl transition-all sm:max-w-sm sm:align-middle dark:bg-gray-800">
              <div className="space-y-2">
                <b className="text-xl">{title}</b>
                <p>{description}</p>
              </div>
              <div>{children}</div>
              <div className="space-y-3">
                {onConfirm ? (
                  <Button
                    className="w-full"
                    disabled={isPerformingAction}
                    onClick={() => onConfirm()}
                    size="lg"
                    variant={isDestructive ? 'danger' : 'primary'}
                  >
                    {confirmText}
                  </Button>
                ) : null}
                <Button
                  className="w-full"
                  disabled={isPerformingAction}
                  onClick={onClose}
                  outline
                  size="lg"
                  variant="secondary"
                >
                  {cancelText}
                </Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
