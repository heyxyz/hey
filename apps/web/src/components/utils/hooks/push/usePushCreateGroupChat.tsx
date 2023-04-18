import type { GroupDTO } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { useCallback } from 'react';
import { useAppStore } from 'src/store/app';

const usePushCreateGroup = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { ownedBy } = currentProfile || {};
  const createGroup = useCallback(
    async (groupInfo: GroupDTO, decryptedKeys: string): Promise<boolean | undefined> => {
      if (!groupInfo || !decryptedKeys) {
        return false;
      }
      const { groupName, groupDescription, groupImage } = groupInfo;
      const response = await PushAPI.chat.createGroup({
        groupName,
        groupDescription: groupDescription as string,
        members: [],
        groupImage: groupImage as string,
        admins: [],
        isPublic: true,
        account: ownedBy,
        pgpPrivateKey: decryptedKeys //decrypted private key
      });
      if (!response) {
        return false;
      }
      return true;
    },
    [ownedBy]
  );
  return { createGroup };
};

export default usePushCreateGroup;
