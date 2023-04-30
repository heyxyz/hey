import { snapshotClient } from '@lib/snapshotClient';
import { useAppStore } from 'src/store/app';
import { useSigner } from 'wagmi';

interface UseCreatePollProps {
  length: number;
  choices: string[];
}

const useCreatePoll = async ({
  length,
  choices
}: UseCreatePollProps): Promise<{
  snapshotUrl: string;
  loading: boolean;
  error: unknown;
}> => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { data: signer } = useSigner();

  const receipt = await snapshotClient.proposal(
    signer as any,
    currentProfile?.ownedBy,
    {
      space: 'yam.eth',
      type: 'single-choice', // define the voting system
      title: 'Test proposal using Snapshot.js',
      body: 'This is the content of the proposal',
      choices: ['Alice', 'Bob', 'Carol'],
      start: 1636984800,
      end: 1637244000,
      snapshot: 13620822,
      network: '1',
      plugins: JSON.stringify({}),
      app: 'my-app' // provide the name of your project which is using this snapshot.js integration
    }
  );

  return { snapshotUrl, loading, error };
};

export default useCreatePoll;
