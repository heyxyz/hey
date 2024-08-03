import { useState } from 'react';
import { parseEther } from 'viem';
import { useAccount, useBalance, useContractWrite } from 'wagmi';
import { Button, Input } from '../ui/components';
import { LENS_HUB_ABI, LENS_HUB_ADDRESS } from '../constants';
import { createActOnOpenActionRequest } from 'pwyw-collect-module';

const SUPPORTED_TOKENS = [
  { value: '0x0000000000000000000000000000000000000000', label: 'ETH' },
  { value: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', label: 'WMATIC' }
  // Add more supported tokens here
];

const PWYWCollectModule = ({ publication, openAction }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(SUPPORTED_TOKENS[0].value);
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: currency !== SUPPORTED_TOKENS[0].value ? currency : undefined
  });

  const { write: collect } = useContractWrite({
    address: LENS_HUB_ADDRESS,
    abi: LENS_HUB_ABI,
    functionName: 'act'
  });

  const handleCollect = async () => {
    if (!amount) return;

    const request = createActOnOpenActionRequest({
      publication,
      action: openAction,
      referrer: null
    });

    collect({
      args: [request]
    });
  };

  return (
    <div>
      <Input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        {SUPPORTED_TOKENS.map((token) => (
          <option key={token.value} value={token.value}>
            {token.label}
          </option>
        ))}
      </select>
      <div>
        Balance: {balance?.formatted} {balance?.symbol}
      </div>
      <Button onClick={handleCollect}>Collect</Button>
    </div>
  );
};

export default PWYWCollectModule;