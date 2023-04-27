import type { GroupDTO } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { PUSH_ENV } from 'src/store/push-chat';

interface GroupByName {
  name: string;
}

const useGroupByName = ({ name }: GroupByName) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const fetchGroupByName = useCallback(
    async ({ name }: GroupByName): Promise<GroupDTO | undefined> => {
      setLoading(true);
      try {
        const response = await PushAPI.chat.getGroupByName({
          groupName: name,
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
    [currentProfile, name]
  );

  useEffect(() => {
    fetchGroupByName({ name });
  }, [fetchGroupByName, name]);

  return { fetchGroupByName, loading, error };
};

export default useGroupByName;
