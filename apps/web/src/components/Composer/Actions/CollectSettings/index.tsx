import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { Modal, Tooltip } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import { useCollectModuleStore } from "src/store/non-persisted/post/useCollectModuleStore";
import { usePostLicenseStore } from "src/store/non-persisted/post/usePostLicenseStore";
import CollectForm from "./CollectForm";

const CollectSettings: FC = () => {
  const { reset } = useCollectModuleStore((state) => state);
  const { setLicense } = usePostLicenseStore();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Tooltip content="Collect" placement="top">
        <button
          aria-label="Collect Module"
          className="rounded-full outline-offset-8"
          onClick={() => setShowModal(!showModal)}
          type="button"
        >
          <ShoppingBagIcon className="size-5" />
        </button>
      </Tooltip>
      <Modal
        onClose={() => {
          setShowModal(false);
          setLicense(null);
          reset();
        }}
        show={showModal}
        title="Collect Settings"
      >
        <CollectForm setShowModal={setShowModal} />
      </Modal>
    </>
  );
};

export default CollectSettings;
