import axios from 'axios';
import { IS_MAINNET, SNAPSHOR_RELAY_WORKER_URL } from '@lenster/data';
import { useAppStore } from 'src/store/app';
import { usePublicationStore } from 'src/store/publication';

type CreatePollResponse = string;

const useCreatePoll = (): [createPoll: () => Promise<CreatePollResponse>] => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const pollConfig = usePublicationStore((state) => state.pollConfig);
  const publicationContent = usePublicationStore(
    (state) => state.publicationContent
  );

  const createPoll = async (): Promise<CreatePollResponse> => {
    try {
      const response = await axios({
        url: `${SNAPSHOR_RELAY_WORKER_URL}/createPoll`,
        method: 'POST',
        data: {
          isMainnet: IS_MAINNET,
          title: `Poll by @${currentProfile?.handle}`,
          description: publicationContent,
          choices: pollConfig.choices,
          length: pollConfig.length
        }
      });

      return `${publicationContent}\n\n${response.data.snapshotUrl}`;
    } catch (error) {
      throw error;
    }
  };

  return [createPoll];
};

export default useCreatePoll;
