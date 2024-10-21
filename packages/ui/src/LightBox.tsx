import { Dialog, DialogPanel } from "@headlessui/react";
import { PLACEHOLDER_IMAGE } from "@hey/data/constants";
import type { FC } from "react";

interface LightBoxProps {
  onClose: () => void;
  url: null | string;
}

export const LightBox: FC<LightBoxProps> = ({ onClose, url }) => {
  const show = Boolean(url);

  if (!show) {
    return null;
  }

  return (
    <Dialog open={show} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 flex w-screen items-center justify-center bg-gray-500/75 p-4 dark:bg-gray-900/80">
        <DialogPanel>
          <img
            alt={url || ""}
            className="max-h-screen max-w-fit cursor-pointer"
            onClick={() => window.open(url || "", "_blank")}
            src={url || PLACEHOLDER_IMAGE}
            width={1000}
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
};
