import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { FC, ReactNode } from "react";
import { H3 } from "./Typography";

interface DrawerProps {
  children: ReactNode | ReactNode[];
  onClose?: () => void;
  show: boolean;
  title: ReactNode;
}

export const Drawer: FC<DrawerProps> = ({ children, onClose, show, title }) => {
  const handleClose = () => {
    onClose?.();
  };

  return (
    <Dialog open={show} onClose={handleClose} className="relative z-10">
      <div className="overflow-hidden">
        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <DialogPanel
            transition
            className="w-screen max-w-md transform transition duration-200 ease-in-out data-[closed]:translate-x-full"
          >
            <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-lg dark:bg-black">
              <div className="px-5">
                <div className="flex items-center justify-between">
                  <DialogTitle as={H3}>{title}</DialogTitle>
                  <button className="ml-3" onClick={handleClose} type="button">
                    <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="mt-6 px-5">{children}</div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
