import { Card, TabButton } from '@hey/ui';
import { type FC, useState } from 'react';

import Managers from './Managers';

enum Type {
  MANAGERS = 'MANAGERS',
  MANAGED = 'MANAGED'
}

const ProfileManager: FC = () => {
  const [type, setType] = useState<Type>(Type.MANAGERS);

  return (
    <Card className="linkify space-y-2 p-5">
      <div className="flex items-center gap-3">
        <TabButton
          name="Managers"
          active={type === Type.MANAGERS}
          onClick={() => setType(Type.MANAGERS)}
        />
        <TabButton
          name="Managed"
          active={type === Type.MANAGED}
          onClick={() => setType(Type.MANAGED)}
        />
      </div>
      {type === Type.MANAGERS && <Managers />}
      {type === Type.MANAGED && <Managers />}
    </Card>
  );
};

export default ProfileManager;
