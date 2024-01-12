import type { FC } from 'react';

import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Button, Card, Modal, TabButton } from '@hey/ui';
import { useState } from 'react';

import AddProfileManager from './AddProfileManager';
import Managed from './Managed';
import Managers from './Managers';

enum Type {
  MANAGED = 'MANAGED',
  MANAGERS = 'MANAGERS'
}

const ProfileManager: FC = () => {
  const [type, setType] = useState<Type>(Type.MANAGERS);
  const [showAddManagerModal, setShowAddManagerModal] = useState(false);

  return (
    <Card className="linkify space-y-2 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TabButton
            active={type === Type.MANAGERS}
            name="Managers"
            onClick={() => setType(Type.MANAGERS)}
            showOnSm
          />
          <TabButton
            active={type === Type.MANAGED}
            name="Managed"
            onClick={() => setType(Type.MANAGED)}
            showOnSm
          />
        </div>
        {type === Type.MANAGERS && (
          <>
            <Button
              icon={<PlusCircleIcon className="size-4" />}
              onClick={() => setShowAddManagerModal(true)}
            >
              Add manager
            </Button>
            <Modal
              onClose={() => setShowAddManagerModal(false)}
              show={showAddManagerModal}
              title="Add Profile Manager"
            >
              <AddProfileManager
                setShowAddManagerModal={setShowAddManagerModal}
              />
            </Modal>
          </>
        )}
      </div>
      {type === Type.MANAGERS && <Managers />}
      {type === Type.MANAGED && <Managed />}
    </Card>
  );
};

export default ProfileManager;
