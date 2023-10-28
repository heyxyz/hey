import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Button, Card, Modal, TabButton } from '@hey/ui';
import { type FC, useState } from 'react';

import Managed from './Managed';
import Managers from './Managers';
import AddProfileManager from './Managers/AddProfileManager';

enum Type {
  MANAGERS = 'MANAGERS',
  MANAGED = 'MANAGED'
}

const ProfileManager: FC = () => {
  const [type, setType] = useState<Type>(Type.MANAGERS);
  const [showAddManagerModal, setShowAddManagerModal] = useState(false);

  return (
    <Card className="linkify space-y-2 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TabButton
            name="Managers"
            active={type === Type.MANAGERS}
            onClick={() => setType(Type.MANAGERS)}
            showOnSm
          />
          <TabButton
            name="Managed"
            active={type === Type.MANAGED}
            onClick={() => setType(Type.MANAGED)}
            showOnSm
          />
        </div>
        {type === Type.MANAGERS && (
          <>
            <Button
              icon={<PlusCircleIcon className="h-4 w-4" />}
              onClick={() => setShowAddManagerModal(true)}
            >
              Add manager
            </Button>
            <Modal
              show={showAddManagerModal}
              title="Add Profile Manager"
              onClose={() => setShowAddManagerModal(false)}
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
