import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { CollectionIcon } from '@heroicons/react/outline';
import type { Profile } from '@lenster/lens';
import { SuperfluidInflowsDocument } from '@lenster/lens';
import { superfluidClient } from '@lenster/lens/apollo';
import formatHandle from '@lenster/lib/formatHandle';
import { Card, EmptyState, ErrorMessage } from '@lenster/ui';
import { t } from '@lingui/macro';
import { type FC, useEffect, useState } from 'react';

export interface Sender {
  id: string;
}
export interface UnderlyingToken {
  name: string;
  symbol: string;
}
export interface Token {
  name: string;
  symbol: string;
  decimals: string;
  id: string;
  underlyingToken: UnderlyingToken;
}

export interface Inflow {
  id: string;
  sender: Sender;
  token: Token;
  deposit: string;
  currentFlowRate: string;
  createdAtTimestamp: string;
}

interface SubscribersFeedProps {
  profile: Profile;
}

export interface Account {
  createdAtTimestamp: string;
  createdAtBlockNumber: string;
  isSuperApp: boolean;
  updatedAtBlockNumber: string;
  updatedAtTimestamp: string;
  inflows: Inflow[];
}
export interface SuplerfluidInflowsDataType {
  account: Account;
}

const SubscribersFeed: FC<SubscribersFeedProps> = ({ profile }) => {
  const [currentAddress, setCurrentAddress] = useState('');
  const [superfluidInflowsData, setSuperfluidInflowsData] =
    useState<SuplerfluidInflowsDataType>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  console.log('profile?.ownedBy', profile?.ownedBy);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } =
        await superfluidClient.query<SuplerfluidInflowsDataType>({
          query: SuperfluidInflowsDocument,
          variables: { id: profile?.ownedBy.toLowerCase() }
        });
      setCurrentAddress(profile?.ownedBy);
      setSuperfluidInflowsData(data);
      setLoading(false);
      setError(error);
    };

    fetchData();
  }, [profile]);

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (superfluidInflowsData?.account === null) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">
              @{formatHandle(profile?.handle)}
            </span>
            <span>{'has nothing in their subscribers feed yet!'}</span>
          </div>
        }
        icon={<CollectionIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title={t`Failed to load profile subscribers feed`}
        error={error}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {superfluidInflowsData?.account.inflows
        .filter((inflow) => parseFloat(inflow.currentFlowRate) > 0)
        .sort((a, b) => {
          return parseFloat(b.currentFlowRate) - parseFloat(a.currentFlowRate);
        })
        .map((inflow) => {
          const imageURL = `https://nft.superfluid.finance/cfa/v1/getsvg?chain_id=137&sender=${inflow.sender.id}&token_address=${inflow.token.id}&token_symbol=${inflow.token.symbol}&start_date=${inflow.createdAtTimestamp}&receiver=${currentAddress}&flowRate=${inflow.currentFlowRate}&token_decimals=${inflow.token.decimals}`;

          return (
            <Card
              className="divide-y-[1px] p-4 dark:divide-gray-700"
              dataTestId={`profile-subscribers-feed-type`}
              key={'profile-subscribers-card-' + inflow.id}
            >
              <a
                href={`https://polygonscan.com/address/${inflow.sender.id}`}
                target="_blank"
                className="cursor-pointer underline"
                rel="noopener noreferrer"
              >
                <img src={imageURL} />
              </a>
            </Card>
          );
        })}
    </div>
  );
};

export default SubscribersFeed;
