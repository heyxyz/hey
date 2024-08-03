import type { FC } from 'react';
import type {
  AnyPublication,
  MultirecipientFeeCollectOpenActionSettings,
  OpenActionModule,
  SimpleCollectOpenActionSettings
} from '@hey/lens';
import { useCounter } from '@uidotdev/usehooks';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokensStore';
import Link from 'next/link';
import { 
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  PuzzlePieceIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import plur from 'plur';
import { APP_NAME, POLYGONSCAN_URL, REWARDS_ADDRESS, PWYW_COLLECT_MODULE_ADDRESS } from '@hey/data/constants';
import { HelpTooltip, Tooltip, WarningMessage } from '@hey/ui';
import formatDate from '@hey/helpers/datetime/formatDate';
import formatAddress from '@hey/helpers/formatAddress';
import getProfile from '@hey/helpers/getProfile';
import getTokenImage from '@hey/helpers/getTokenImage';
import humanize from '@hey/helpers/humanize';
import nFormatter from '@hey/helpers/nFormatter';
import { isMirrorPublication } from '@hey/helpers/publicationHelpers';
import CountdownTimer from '@components/Shared/CountdownTimer';
import Slug from '@components/Shared/Slug';
import CollectAction from './CollectAction';
import Splits from './Splits';
import { createOpenActionModuleInput } from 'pwyw-collect-module';

interface CollectModuleProps {
  openAction: OpenActionModule;
  publication: AnyPublication;
}

interface PWYWCollectModuleSettings {
  amountFloor: bigint;
  collectLimit: bigint;
  currency: string;
  referralFee: number;
  followerOnly: boolean;
  endTimestamp: bigint;
  recipients: { recipient: string; split: number }[];
}

class CollectModule {
  constructor(private moduleType: string, private settings: any) {}

  handleModule() {
    switch (this.moduleType) {
      case 'MultirecipientFeeCollectOpenActionSettings':
        return this.handleMultirecipientFeeCollectModule();
      case 'SimpleCollectOpenActionSettings':
        return this.handleSimpleCollectModule();
      case 'UnknownOpenActionModuleSettings':
        if (this.settings.contract.address === PWYW_COLLECT_MODULE_ADDRESS) {
          return this.handlePWYWCollectModule();
        }
        return this.handleDefault();
      default:
        return this.handleDefault();
    }
  }

  private handleMultirecipientFeeCollectModule() {
    // Specific logic for MultirecipientFeeCollectOpenActionSettings
    const collectModule = this.settings as MultirecipientFeeCollectOpenActionSettings;
    const endTimestamp = collectModule?.endsAt;
    const collectLimit = parseInt(collectModule?.collectLimit || '0');
    const amount = parseFloat(collectModule?.amount?.value || '0');
    const usdPrice = collectModule?.amount?.asFiat?.value;
    const currency = collectModule?.amount?.asset?.symbol;
    const referralFee = collectModule?.referralFee;
    const recipients = collectModule?.recipients || [];
    const recipientsWithoutFees = recipients.filter(
      (split) => split.recipient !== REWARDS_ADDRESS
    );
    const isMultirecipientFeeCollectModule =
      recipientsWithoutFees.length > 1;
    const percentageCollected = (countOpenActions / collectLimit) * 100;
    const enabledTokens = allowedTokens?.map((t) => t.symbol);
    const isTokenEnabled = enabledTokens?.includes(currency);
    const isSaleEnded = endTimestamp
      ? new Date(endTimestamp).getTime() / 1000 < new Date().getTime() / 1000
      : false;
    const isAllCollected = collectLimit
      ? countOpenActions >= collectLimit
      : false;
    const hasHeyFees = recipients.some(
      (split) => split.recipient === REWARDS_ADDRESS
    );

    // Render the component with the specific data
    return (
      <>
        <div className="flex items-center justify-between space-x-2 text-sm">
          <div className="flex items-center space-x-2">
            <CurrencyDollarIcon className="size-4" />
            <span className="font-bold">{amount.toFixed(4)}</span>
            <span>{currency}</span>
          </div>
          <div className="font-bold">{referralFee}%</div>
        </div>
        <div className="mt-2">
          <Splits recipients={recipients} />
        </div>
        <div className="mt-2">
          <div className="ld-text-gray-500 flex items-center justify-between space-y-0.5">
            <span className="space-x-1">Collect limit</span>
            <span>{collectLimit}</span>
          </div>
          <div className="ld-text-gray-500 flex items-center justify-between space-y-0.5">
            <span className="space-x-1">Collected</span>
            <span>{percentageCollected.toFixed(2)}%</span>
          </div>
        </div>
        {isSaleEnded && (
          <div className="mt-2 ld-text-gray-500 text-sm">
            Sale ended
          </div>
        )}
        {isAllCollected && (
          <div className="mt-2 ld-text-gray-500 text-sm">
            All collected
          </div>
        )}
        {!isTokenEnabled && (
          <div className="mt-2 ld-text-gray-500 text-sm">
            Token not enabled
          </div>
        )}
        {hasHeyFees && (
          <div className="mt-2 ld-text-gray-500 text-sm">
            Hey fees included
          </div>
        )}
      </>
    );
  }

  private handleSimpleCollectModule() {
    // Specific logic for SimpleCollectOpenActionSettings
    const collectModule = this.settings as SimpleCollectOpenActionSettings;
    const endTimestamp = collectModule?.endsAt;
    const collectLimit = parseInt(collectModule?.collectLimit || '0');
    const amount = parseFloat(collectModule?.amount?.value || '0');
    const usdPrice = collectModule?.amount?.asFiat?.value;
    const currency = collectModule?.amount?.asset?.symbol;
    const percentageCollected = (countOpenActions / collectLimit) * 100;
    const enabledTokens = allowedTokens?.map((t) => t.symbol);
    const isTokenEnabled = enabledTokens?.includes(currency);
    const isSaleEnded = endTimestamp
      ? new Date(endTimestamp).getTime() / 1000 < new Date().getTime() / 1000
      : false;
    const isAllCollected = collectLimit
      ? countOpenActions >= collectLimit
      : false;

    // Render the component with the specific data
    return (
      <>
        <div className="flex items-center justify-between space-x-2 text-sm">
          <div className="flex items-center space-x-2">
            <CurrencyDollarIcon className="size-4" />
            <span className="font-bold">{amount.toFixed(4)}</span>
            <span>{currency}</span>
          </div>
        </div>
        <div className="mt-2">
          <div className="ld-text-gray-500 flex items-center justify-between space-y-0.5">
            <span className="space-x-1">Collect limit</span>
            <span>{collectLimit}</span>
          </div>
          <div className="ld-text-gray-500 flex items-center justify-between space-y-0.5">
            <span className="space-x-1">Collected</span>
            <span>{percentageCollected.toFixed(2)}%</span>
          </div>
        </div>
        {isSaleEnded && (
          <div className="mt-2 ld-text-gray-500 text-sm">
            Sale ended
          </div>
        )}
        {isAllCollected && (
          <div className="mt-2 ld-text-gray-500 text-sm">
            All collected
          </div>
        )}
        {!isTokenEnabled && (
          <div className="mt-2 ld-text-gray-500 text-sm">
            Token not enabled
          </div>
        )}
      </>
    );
  }

  private handlePWYWCollectModule() {
    const collectModule = this.settings as PWYWCollectModuleSettings;
    const endTimestamp = collectModule.endTimestamp;
    const collectLimit = Number(collectModule.collectLimit);
    const amountFloor = Number(collectModule.amountFloor);
    const currency = collectModule.currency;
    const referralFee = collectModule.referralFee;
    const recipients = collectModule.recipients;
    const followerOnly = collectModule.followerOnly;

    const percentageCollected = (countOpenActions / collectLimit) * 100;
    const enabledTokens = allowedTokens?.map((t) => t.symbol);
    const isTokenEnabled = enabledTokens?.includes(currency);
    const isSaleEnded = endTimestamp
      ? BigInt(endTimestamp) < BigInt(Math.floor(Date.now() / 1000))
      : false;
    const isAllCollected = collectLimit > 0 ? countOpenActions >= collectLimit : false;

    return (
      <>
        <div className="flex items-center justify-between space-x-2 text-sm">
          <div className="flex items-center space-x-2">
            <CurrencyDollarIcon className="size-4" />
            <span className="font-bold">Pay What You Want (Min: {amountFloor})</span>
            <span>{currency}</span>
          </div>
          <div className="font-bold">{referralFee}% referral fee</div>
        </div>
        {followerOnly && (
          <div className="mt-2 text-sm text-gray-500">
            Only followers can collect
          </div>
        )}
        <div className="mt-2">
          <Splits recipients={recipients} />
        </div>
        <div className="mt-2">
          <div className="flex items-center justify-between space-y-0.5 text-sm text-gray-500">
            <span>Collect limit</span>
            <span>{collectLimit > 0 ? collectLimit : 'Unlimited'}</span>
          </div>
          {collectLimit > 0 && (
            <div className="flex items-center justify-between space-y-0.5 text-sm text-gray-500">
              <span>Collected</span>
              <span>{percentageCollected.toFixed(2)}%</span>
            </div>
          )}
        </div>
        {endTimestamp > 0 && (
          <div className="mt-2 text-sm text-gray-500">
            {isSaleEnded ? (
              'Sale ended'
            ) : (
              <>
                Sale ends: <CountdownTimer targetDate={new Date(Number(endTimestamp) * 1000)} />
              </>
            )}
          </div>
        )}
        {isAllCollected && (
          <div className="mt-2 text-sm text-gray-500">
            All collected
          </div>
        )}
        {!isTokenEnabled && (
          <div className="mt-2 text-sm text-gray-500">
            Token not enabled
          </div>
        )}
      </>
    );
  }

  private handleDefault() {
    // Default handling logic
    return null;
  }
}

const CollectModule: FC<CollectModuleProps> = ({ openAction, publication }) => {
  const { allowedTokens } = useAllowedTokensStore();
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const [countOpenActions, { increment }] = useCounter(
    targetPublication.stats.countOpenActions
  );

  const collectModule = openAction as
    | MultirecipientFeeCollectOpenActionSettings
    | SimpleCollectOpenActionSettings
    | PWYWCollectModuleSettings;

  const collectModuleInstance = new CollectModule(
    openAction.__typename,
    collectModule
  );

  return (
    <div className="space-y-2">
      {collectModuleInstance.handleModule()}
      <CollectAction
        publication={targetPublication}
        openAction={openAction}
        countOpenActions={countOpenActions}
        increment={increment}
      />
    </div>
  );
};

export default CollectModule;