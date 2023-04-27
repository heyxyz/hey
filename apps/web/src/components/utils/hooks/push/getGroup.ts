import type { GroupDTO } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV } from 'src/store/push-chat';

interface fetchGroup {
  account: string;
}

const useGetGroup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const currentProfile = useAppStore((state) => state.currentProfile);
  const { ownedBy } = currentProfile || {};
  const fetchGroup = useCallback(
    async ({ account }: fetchGroup): Promise<GroupDTO | undefined> => {
      setLoading(true);
      try {
        const response = await PushAPI.chat.getGroup({
          chatId: `eip155:${account}`,
          env: PUSH_ENV
        });
        if (!response) {
          return;
        }
        return response;
      } catch (error: Error | any) {
        setLoading(false);
        console.log(error);
        setError(error.message);
      }
    },
    [ownedBy]
  );
  return { fetchGroup, loading, error };
};

export default useGetGroup;
