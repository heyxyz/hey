import type { FC, ReactNode } from 'react';

import { XMarkIcon } from '@heroicons/react/24/outline';
import * as Dialog from '@radix-ui/react-dialog';

import cn from '../cn';

interface ModalProps {
  children: ReactNode | ReactNode[];
  icon?: ReactNode;
  onClose?: () => void;
  show: boolean;
  size?: 'lg' | 'md' | 'sm' | 'xs';
  title?: ReactNode;
}

export const Modal: FC<ModalProps> = ({
  children,
  icon,
  onClose,
  show,
  size = 'sm',
  title
}) => {
  return (
    <Dialog.Root onOpenChange={(open) => !open && onClose?.()} open={show}>
      <Dialog.Portal>
        <div className="fixed inset-0 z-10 flex min-h-screen items-center justify-center overflow-y-auto p-4 text-center sm:block sm:p-0">
          <Dialog.Overlay className="fixed inset-0 bg-gray-500/75 transition-opacity dark:bg-gray-900/80" />
          <Dialog.Content className={'menu-transition'}>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" />
            <div
              className={cn(
                { 'sm:max-w-5xl': size === 'lg' },
                { 'sm:max-w-3xl': size === 'md' },
                { 'sm:max-w-lg': size === 'sm' },
                { 'sm:max-w-sm': size === 'xs' },
                'inline-block w-full scale-100 rounded-xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle dark:bg-gray-800'
              )}
            >
              {title ? (
                <div className="divider flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center space-x-2 font-bold">
                    {icon}
                    <div>{title}</div>
                  </div>
                  {onClose ? (
                    <button
                      className="outline-brand-500 rounded-full p-1 text-gray-800 hover:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-700"
                      onClick={onClose}
                      type="button"
                    >
                      <XMarkIcon className="size-5" />
                    </button>
                  ) : null}
                </div>
              ) : null}
              {children}
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
