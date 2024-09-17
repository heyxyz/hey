import type { FC, ReactNode } from "react";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild
} from "@headlessui/react";
import { Fragment } from "react";

import { Button } from "./Button";
import { H4 } from "./Typography";

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
  cancelText = "Cancel",
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
    <Transition as={Fragment} show={show}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => onClose?.()}
      >
        <div className="flex min-h-screen items-center justify-center p-4 text-center sm:block sm:p-0">
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" />
          <div
            aria-hidden="true"
            className="fixed inset-0 bg-gray-500/75 transition-opacity dark:bg-gray-900/80"
          />
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel className="inline-block w-full scale-100 space-y-6 rounded-xl bg-white p-5 text-left align-bottom shadow-xl transition-all sm:max-w-sm sm:align-middle dark:bg-gray-800">
              <DialogTitle className="space-y-2">
                <H4>{title}</H4>
                <p>{description}</p>
              </DialogTitle>
              <div>{children}</div>
              <div className="space-y-3">
                {onConfirm ? (
                  <Button
                    className="w-full"
                    disabled={isPerformingAction}
                    onClick={() => onConfirm()}
                    size="lg"
                    variant={isDestructive ? "danger" : "primary"}
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
                >
                  {cancelText}
                </Button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
