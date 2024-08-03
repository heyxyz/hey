import { useState } from 'react';
import { parseEther } from 'viem';
import { useAccount, useBalance, useContractWrite } from 'wagmi';
import { createActOnOpenActionRequest } from 'pwyw-collect-module';
import { LENS_HUB_ABI, LENS_HUB_ADDRESS } from '../constants';
import { Button, Input } from '../ui/components';

const SUPPORTED_TOKENS = [
  { label: 'ETH', value: '0x0000000000000000000000000000000000000000' },
  { label: 'WMATIC', value: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889' }
  // Add more supported tokens here
];

const PWYWCollectModule = ({ openAction, publication }) => {
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

  const handleCollect = () => {
    if (!amount) {
      return;
    }

    const request = createActOnOpenActionRequest({
      action: openAction,
      publication,
      referrer: null
    });

    collect({
      args: [request]
    });
  };

  return (
    <div>
      <Input
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        type="number"
        value={amount}
      />
      <select onChange={(e) => setCurrency(e.target.value)} value={currency}>
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