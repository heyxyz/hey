import type { FC, ReactNode } from 'react';

import * as Dialog from '@radix-ui/react-dialog';

import { Button } from './Button';

interface AlertProps {
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
    <Dialog.Root onOpenChange={(open) => !open && onClose?.()} open={show}>
      <Dialog.Portal>
        <div className="fixed inset-0 z-10 flex min-h-screen items-center justify-center overflow-y-auto p-4 text-center sm:block sm:p-0">
          <Dialog.Overlay className="menu-transition fixed inset-0 bg-gray-500/75 transition-opacity dark:bg-gray-900/80" />
          <Dialog.Content className="menu-transition">
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" />
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
                  onClick={onClose}
                  outline
                  size="lg"
                  variant="secondary"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
