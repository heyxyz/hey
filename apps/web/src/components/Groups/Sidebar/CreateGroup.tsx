import { APP_NAME } from "@hey/data/constants";
import { Button, Card, H5, Modal } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import CreateGroupModal from "./CreateGroupModal";

const CreateGroup: FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card as="aside" className="space-y-4 p-5">
        <div className="space-y-1">
          <H5>Create a group</H5>
          <div>
            Create a new group on {APP_NAME}
          </div>
        </div>
        <Button onClick={() => setShowModal(true)}>
          Create group
        </Button>
      </Card>
      <Modal
        onClose={() => setShowModal(false)}
        show={showModal}
        title="Create a group"
      >
        <CreateGroupModal />
      </Modal>
    </>
  );
};

export default CreateGroup;
