import type { FC } from "react";

import { PLACEHOLDER_IMAGE } from "@hey/data/constants";

import { Modal } from "./Modal";

interface LightBoxProps {
  onClose: () => void;
  show: boolean;
  url: null | string;
}

export const LightBox: FC<LightBoxProps> = ({ onClose, show, url }) => {
  return (
    <Modal onClose={onClose} show={show} size="md">
      <img
        alt={url || ""}
        className="max-h-screen cursor-pointer rounded-xl"
        height={1000}
        onClick={() => window.open(url || "", "_blank")}
        src={url || PLACEHOLDER_IMAGE}
        width={1000}
      />
    </Modal>
  );
};
