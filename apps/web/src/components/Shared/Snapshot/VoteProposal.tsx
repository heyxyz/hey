import { Errors, FeatureFlag } from 'data';
import humanize from 'lib/humanize';
import isFeatureEnabled from 'lib/isFeatureEnabled';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import type { Proposal } from 'snapshot';
import { useAppStore } from 'src/store/app';
import { Button } from 'ui';
import { useSignTypedData } from 'wagmi';

interface VoteProposalProps {
  proposal: Proposal;
  voteConfig: {
    show: boolean;
    position: number;
  };
  setVoteConfig: (voteConfig: { show: boolean; position: number }) => void;
}

const VoteProposal: FC<VoteProposalProps> = ({ proposal, voteConfig, setVoteConfig }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { signTypedDataAsync } = useSignTypedData({});
  const { choices, snapshot } = proposal;
  const choice = choices[voteConfig.position - 1];

  const sign = async (position: number) => {
    if (!isFeatureEnabled(FeatureFlag.SnapshotVoting, currentProfile?.id)) {
      return;
    }

    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    // TODO: allow only single choice

    const typedData = {
      domain: { name: 'snapshot', version: '0.1.4' },
      types: {
        Vote: [
          { name: 'from', type: 'address' },
          { name: 'space', type: 'string' },
          { name: 'timestamp', type: 'uint64' },
          { name: 'proposal', type: 'bytes32' },
          { name: 'choice', type: 'uint32' },
          { name: 'reason', type: 'string' },
          { name: 'app', type: 'string' },
          { name: 'metadata', type: 'string' }
        ]
      },
      value: {
        space: proposal.space?.id as string,
        proposal: proposal.id as `0x${string}`,
        choice: position,
        app: 'snapshot',
        reason: '',
        metadata: '{}',
        from: currentProfile?.ownedBy,
        timestamp: Number((Date.now() / 1e3).toFixed()) as any
      }
    };
    const signature = await signTypedDataAsync(typedData);
    console.log(signature);
  };

  return (
    <div className="space-y-2 p-5">
      <div className="flex items-center justify-between">
        <b>Choice</b>
        <span>{choice}</span>
      </div>
      <div className="flex items-center justify-between">
        <b>Snapshot</b>
        <span>{humanize(parseInt(snapshot as string))}</span>
      </div>
      <div className="flex items-center justify-between">
        <b>Your voting power</b>
        <span>{humanize(parseInt(snapshot as string))}</span>
      </div>
      <div className="flex space-x-2 pt-3">
        <Button
          className="w-full"
          size="lg"
          variant="secondary"
          onClick={() => setVoteConfig({ show: false, position: 0 })}
          outline
        >
          Cancel
        </Button>
        <Button className="w-full" size="lg" onClick={() => sign(voteConfig.position)}>
          Vote
        </Button>
      </div>
    </div>
  );
};

export default VoteProposal;
