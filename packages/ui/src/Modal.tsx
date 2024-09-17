import type { FC, ReactNode, SyntheticEvent } from "react";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

import cn from "../cn";

interface ModalProps {
  children: ReactNode | ReactNode[];
  icon?: ReactNode;
  onClose?: () => void;
  show: boolean;
  size?: "lg" | "md" | "sm" | "xs";
  title?: ReactNode;
}

export const Modal: FC<ModalProps> = ({
  children,
  icon,
  onClose,
  show,
  size = "sm",
  title
}) => {
  const handleClose = (e: SyntheticEvent) => {
    e.stopPropagation(); // This stops the event from propagating further
    onClose?.();
  };

  return (
    <Transition as={Fragment} show={show}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 flex min-h-screen items-center justify-center overflow-y-auto p-4 text-center sm:block sm:p-0"
        onClose={() => onClose?.()}
      >
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" />
        <div
          aria-hidden="true"
          className="fixed inset-0 bg-gray-500/75 transition-opacity dark:bg-gray-900/80"
          onClick={handleClose}
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
          <DialogPanel
            className={cn(
              { "sm:max-w-5xl": size === "lg" },
              { "sm:max-w-3xl": size === "md" },
              { "sm:max-w-lg": size === "sm" },
              { "sm:max-w-sm": size === "xs" },
              "inline-block w-full scale-100 rounded-xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle dark:bg-gray-800"
            )}
          >
            {title ? (
              <DialogTitle className="divider flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center space-x-2 font-bold">
                  {icon}
                  <div>{title}</div>
                </div>
                {onClose ? (
                  <button
                    className="rounded-full p-1 text-gray-800 hover:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    type="button"
                  >
                    <XMarkIcon className="size-5" />
                  </button>
                ) : null}
              </DialogTitle>
            ) : null}
            {children}
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
};
