import { IS_MAINNET, SNAPSHOR_RELAY_WORKER_URL } from '@hey/data/constants';
import getProfile from '@hey/lib/getProfile';
import axios from 'axios';
import { useAppStore } from 'src/store/useAppStore';
import { hydrateAuthTokens } from 'src/store/useAuthPersistStore';
import { usePublicationStore } from 'src/store/usePublicationStore';

type CreatePollResponse = string;

const useCreatePoll = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const pollConfig = usePublicationStore((state) => state.pollConfig);
  const publicationContent = usePublicationStore(
    (state) => state.publicationContent
  );

  // TODO: use useCallback
  const createPoll = async (): Promise<CreatePollResponse> => {
    try {
      const response = await axios.post(
        `${SNAPSHOR_RELAY_WORKER_URL}/createPoll`,
        {
          title: `Poll by ${getProfile(currentProfile).slugWithPrefix}`,
          description: publicationContent,
          choices: pollConfig.choices,
          length: pollConfig.length
        },
        {
          headers: {
            'X-Access-Token': hydrateAuthTokens().accessToken,
            'X-Lens-Network': IS_MAINNET ? 'mainnet' : 'testnet'
          }
        }
      );

      return `${publicationContent}\n\n${response.data.snapshotUrl}`;
    } catch (error) {
      throw error;
    }
  };

  return createPoll;
};

export default useCreatePoll;
