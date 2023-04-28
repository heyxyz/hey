import type { GroupDTO } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';
import { PUSH_ENV } from 'src/store/push-chat';

interface IGroupByNameProps {
  name: string;
}

const useGroupByName = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const fetchGroupByName = useCallback(async ({ name }: IGroupByNameProps): Promise<GroupDTO | undefined> => {
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
  }, []);

  return { fetchGroupByName, loading, error };
};

export default useGroupByName;
