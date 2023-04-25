import type { IUser } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';
import { PUSH_ENV } from 'src/store/push-chat';

interface conversationHashParams {
  userIds: string[];
}

const useGetUsersBatch = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const getUsersBatch = useCallback(
    async ({ userIds }: conversationHashParams): Promise<IUser | undefined> => {
      setLoading(true);
      try {
        const response = await PushAPI.user.getBatch({
          userIds,
          env: PUSH_ENV
        });
        setLoading(false);
        return response;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
      }
    },
    []
  );
  return { getUsersBatch, error, loading };
};

export default useGetUsersBatch;
