import type { Proposal } from '../generated';

const generateTypedData = (
  proposal: Proposal,
  position: number,
  from: `0x${string}`
) => {
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
    message: {
      space: proposal.space?.id as string,
      proposal: proposal.id as `0x${string}`,
      choice: position,
      app: 'lenster',
      reason: '',
      metadata: '{}',
      from,
      timestamp: Math.floor(Date.now() / 1000)
    }
  };

  return typedData;
};

export default generateTypedData;
