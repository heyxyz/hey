import { snapshotClient } from '@lib/snapshotClient';
import { APP_NAME } from 'data';
import { useAppStore } from 'src/store/app';
import { usePublicationStore } from 'src/store/publication';
import { useSigner } from 'wagmi';

type CreatePollResponse = string;

const useCreatePoll = (): [createPoll: () => Promise<CreatePollResponse>] => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const pollConfig = usePublicationStore((state) => state.pollConfig);
  const publicationContent = usePublicationStore(
    (state) => state.publicationContent
  );
  const { data: signer } = useSigner();

  const createPoll = async (): Promise<CreatePollResponse> => {
    try {
      const receipt: any = await snapshotClient.proposal(
        signer as any,
        currentProfile?.ownedBy,
        {
          space: 'polls.lenster.xyz',
          type: 'single-choice',
          title: 'Test proposal using Snapshot.js',
          body: 'This is the content of the proposal',
          from: currentProfile?.ownedBy,
          choices: pollConfig.choices,
          start: Math.floor(Date.now() / 1000),
          end: Math.floor(Date.now() / 1000) + pollConfig.length * 86400,
          snapshot: 17159126,
          discussion: '',
          plugins: '{}',
          app: APP_NAME.toLowerCase()
        }
      );

      return `${publicationContent}\n\nhttps://snapshot.org/#/polls.lenster.xyz/proposal/${receipt.id}`;
    } catch (error) {
      throw error;
    }
  };

  return [createPoll];
};

export default useCreatePoll;
