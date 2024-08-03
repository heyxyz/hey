import { useState } from 'react';
import { useContractWrite, useAccount, useBalance } from 'wagmi';
import { parseEther } from 'viem';
import { Button, Input, Select } from '../ui/components';
import { LENS_HUB_ABI, LENS_HUB_ADDRESS, PWYW_COLLECT_MODULE_ADDRESS } from '../constants';
import { createOpenActionModuleInput, createActOnOpenActionRequest } from 'pwyw-collect-module';

const SUPPORTED_TOKENS = [
  { value: '0x0000000000000000000000000000000000000000', label: 'MATIC' },
  { value: '0x3d2bD0e15829AA5C362a4144FdF4A1112fa29B5c', label: 'BONSAI' },
  // Add more supported tokens here
];

export class PWYWCollectModule {
  constructor({ publicationId }) {
    this.publicationId = publicationId;
  }

  render() {
    const [amount, setAmount] = useState('');
    const [selectedToken, setSelectedToken] = useState(SUPPORTED_TOKENS[0].value);
    const { address } = useAccount();
    const { data: balance } = useBalance({ address, token: selectedToken });

    const { write: collect } = useContractWrite({
      address: LENS_HUB_ADDRESS,
      abi: LENS_HUB_ABI,
      functionName: 'act',
    });

    const handleCollect = async () => {
      if (!amount || !selectedToken) return;

      const actOnRequest = createActOnOpenActionRequest(this.publicationId, {
        collectNftRecipient: address,
        currency: selectedToken,
        amount: parseEther(amount),
      });

      collect({ args: [actOnRequest] });
    };

    return (
      <div className="space-y-4">
        <Input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Select
          options={SUPPORTED_TOKENS}
          value={selectedToken}
          onChange={(value) => setSelectedToken(value)}
        />
        <p>Balance: {balance?.formatted} {balance?.symbol}</p>
        <Button onClick={handleCollect}>Collect</Button>
      </div>
    );
  }
}