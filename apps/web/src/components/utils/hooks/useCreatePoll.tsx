import axios from 'axios';
import { IS_MAINNET, SNAPSHOR_RELAY_WORKER_URL } from 'data';
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
    const response = await axios.post(SNAPSHOR_RELAY_WORKER_URL, {
      isMainnet: IS_MAINNET,
      title: `Poll by @${currentProfile?.handle}`,
      desctiption: publicationContent,
      choices: pollConfig.choices,
      length: pollConfig.length
    });

    return response.data.snapshotUrl;
  };

  return [createPoll];
};

export default useCreatePoll;
