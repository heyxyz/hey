import type { GroupDTO } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';
import { PUSH_ENV } from 'src/store/push-chat';

interface IFetchGroupProps {
  chatId: string;
}

const useGetGroup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const fetchGroup = useCallback(async ({ chatId }: IFetchGroupProps): Promise<GroupDTO | undefined> => {
    setLoading(true);
    try {
      const response = await PushAPI.chat.getGroup({
        chatId: chatId,
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
  return { fetchGroup, loading, error };
};

export default useGetGroup;
