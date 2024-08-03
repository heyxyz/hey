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
import { APP_NAME, POLYGONSCAN_URL, REWARDS_ADDRESS } from '@hey/data/constants';
import { HelpTooltip, Tooltip, WarningMessage } from '@hey/ui';
import formatDate from '@hey/helpers/datetime/formatDate';
import formatAddress from '@hey/helpers/formatAddress';
import getProfile from '@hey/helpers/getProfile';
import getTokenImage from '@hey/helpers/getTokenImage';
import humanize from '@hey/helpers/humanize';
import nFormatter from '@hey/helpers/nFormatter';
import { isMirrorPublication, isPWYWCollectModule } from '@hey/helpers/publicationHelpers';
import CountdownTimer from '@components/Shared/CountdownTimer';
import Slug from '@components/Shared/Slug';
import CollectAction from './CollectAction';
import { PWYWCollectModule } from '@components/PWYWCollectModule';
import Splits from './Splits';

interface CollectModuleProps {
  openAction: OpenActionModule;
  publication: AnyPublication;
}

class CollectModule {
  constructor(private moduleType: string, private settings: any) {}

  // Using polymorphism to handle different module types
  handleModule() {
    switch (this.moduleType) {
      case 'MultirecipientFeeCollectOpenActionSettings':
        return this.handleMultirecipientFeeCollectModule();
      case 'SimpleCollectOpenActionSettings':
        return this.handleSimpleCollectModule();
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
        {/* Render the component with the specific data */}
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
        {/* Render the component with the specific data */}
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
    | SimpleCollectOpenActionSettings;

  const collectModuleInstance = new CollectModule(
    collectModule.__typename,
    collectModule
  );

  return collectModuleInstance.handleModule();
};

export default CollectModule;