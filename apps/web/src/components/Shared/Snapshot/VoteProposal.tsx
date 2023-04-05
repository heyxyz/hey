import { ExclamationIcon } from '@heroicons/react/outline';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import humanize from 'lib/humanize';
import type { FC } from 'react';
import type { Proposal } from 'snapshot';
import { useAppStore } from 'src/store/app';
import { Button, Spinner } from 'ui';
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
  const { choices, snapshot, network, strategies, space, state, symbol } = proposal;
  const choice = choices[voteConfig.position - 1];

  const getScore = async () => {
    const response = await axios({
      url: 'https://score.snapshot.org',
      method: 'POST',
      data: {
        jsonrpc: '2.0',
        method: 'get_vp',
        params: {
          address: currentProfile?.ownedBy,
          network,
          strategies,
          snapshot: parseInt(snapshot as string),
          space: space?.id,
          delegation: false
        },
        id: null
      }
    });

    return response.data;
  };

  const { data, isLoading, error } = useQuery(
    ['statsData', currentProfile?.ownedBy, proposal.id],
    () => getScore().then((res) => res),
    { enabled: state === 'active' }
  );

  const sign = async (position: number) => {
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

  const vp = data?.result?.vp_by_strategy ?? [0];
  const totalVotingPower = vp.reduce((a: number, b: number) => a + b, 0);

  return (
    <>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <b>Choice</b>
          <span className="max-w-xs truncate" title={choice ?? ''}>
            {choice}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <b>Snapshot</b>
          <span>{humanize(parseInt(snapshot as string))}</span>
        </div>
        <div className="flex items-center justify-between">
          <b>Your voting power</b>
          <span>
            {isLoading ? (
              <Spinner size="xs" />
            ) : error ? (
              <ExclamationIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <>
                {humanize(totalVotingPower)} {symbol}
              </>
            )}
          </span>
        </div>
      </div>
      <div className="flex space-x-2 border-t p-5">
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
    </>
  );
};

export default VoteProposal;
