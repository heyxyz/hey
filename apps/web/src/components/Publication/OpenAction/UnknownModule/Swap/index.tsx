import type {
  MirrorablePublication,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { AllowedToken } from '@hey/types/hey';
import type { FC } from 'react';
import type { Address } from 'viem';

import Loader from '@components/Shared/Loader';
import { DEFAULT_COLLECT_TOKEN, REWARDS_ADDRESS } from '@hey/data/constants';
import { USD_ENABLED_TOKEN_SYMBOLS } from '@hey/data/tokens-symbols';
import { useModuleMetadataQuery } from '@hey/lens';
import getAllTokens from '@hey/lib/api/getAllTokens';
import getAssetSymbol from '@hey/lib/getAssetSymbol';
import getRedstonePrice from '@hey/lib/getRedstonePrice';
import { Button, Card } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useActOnUnknownOpenAction from 'src/hooks/useActOnUnknownOpenAction';
import { encodeAbiParameters, formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';

interface SwapOpenActionProps {
  module: UnknownOpenActionModuleSettings;
  publication: MirrorablePublication;
}

const SwapOpenAction: FC<SwapOpenActionProps> = ({ module, publication }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<AllowedToken | null>(
    null
  );
  const [usdPrice, setUsdPrice] = useState(0);
  const [tip, setTip] = useState({
    currency: DEFAULT_COLLECT_TOKEN,
    value: [5]
  });

  const { address } = useAccount();

  const getUsdPrice = async () => {
    const usdPrice = await getRedstonePrice(
      getAssetSymbol(selectedCurrency?.symbol as string)
    );
    setUsdPrice(usdPrice);
  };

  useEffect(() => {
    getUsdPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrency]);

  const { data: balanceData } = useBalance({
    address,
    query: { refetchInterval: 2000 },
    token: selectedCurrency?.contractAddress as Address
  });

  const { data, loading } = useModuleMetadataQuery({
    skip: !Boolean(module?.contract.address),
    variables: { request: { implementation: module?.contract.address } }
  });

  const metadata = data?.moduleMetadata?.metadata;
  const balance = balanceData
    ? parseFloat(
        formatUnits(balanceData.value, selectedCurrency?.decimals as number)
      ).toFixed(selectedCurrency?.symbol === 'WETH' ? 4 : 2)
    : 0;
  const usdEnabled = USD_ENABLED_TOKEN_SYMBOLS.includes(
    selectedCurrency?.symbol as string
  );

  const { actOnUnknownOpenAction, isLoading } = useActOnUnknownOpenAction({
    signlessApproved: module.signlessApproved,
    successToast: "You've sent a tip!"
  });

  const { data: allowedTokens, isLoading: loadingAllowedTokens } = useQuery({
    queryFn: () =>
      getAllTokens((tokens) =>
        setSelectedCurrency(
          tokens.find(
            (token) => token.contractAddress === DEFAULT_COLLECT_TOKEN
          ) as AllowedToken
        )
      ),
    queryKey: ['getAllTokens']
  });

  if (loading || loadingAllowedTokens) {
    return <Loader className="m-5" message="Loading tip..." />;
  }

  const act = async () => {
    if (usdEnabled && usdPrice === 0) {
      return toast.error('Failed to get USD price');
    }

    const abi = JSON.parse(metadata?.processCalldataABI);
    // const currency = allowedTokens?.find(
    //   (token) => token.contractAddress === tip.currency
    // );

    // if (!currency) {
    //   return toast.error('Currency not supported');
    // }

    const amount = tip.value[0];
    const usdValue = usdEnabled ? amount / usdPrice : amount;

    const calldata = encodeAbiParameters(abi, [
      [
        '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
        10000,
        '0x83816640bf2bb88c96b13ae73d12e0135c2b4816'
      ],
      Math.floor(Date.now() / 1000) + 20 * 60,
      '1000000000000000000',
      0,
      REWARDS_ADDRESS
    ]);

    return await actOnUnknownOpenAction({
      address: module.contract.address,
      data: calldata,
      publicationId: publication.id
    });
  };

  return (
    <Card className="space-y-3 p-5">
      {JSON.stringify(data)}
      <Button onClick={act}>Act</Button>
    </Card>
  );
};

export default SwapOpenAction;
