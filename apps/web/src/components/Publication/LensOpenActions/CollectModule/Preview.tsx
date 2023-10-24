import CountdownTimer from '@components/Shared/CountdownTimer';
import GetOpenActionModuleIcon from '@components/Shared/GetOpenActionModuleIcon';
import type { AnyPublication, OpenActionModule } from '@hey/lens';
import getOpenActionModuleData from '@hey/lib/getOpenActionModuleData';
import getTokenImage from '@hey/lib/getTokenImage';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import plur from 'plur';
import type { FC } from 'react';
import { useOpenActionStore } from 'src/store/OptimisticActions/useOpenActionStore';

interface CollectModulePreviewProps {
  module: OpenActionModule;
  publication: AnyPublication;
}

const CollectModulePreview: FC<CollectModulePreviewProps> = ({
  module,
  publication
}) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const { getOpenActionCountByPublicationId } = useOpenActionStore();

  if (
    module.__typename === 'SimpleCollectOpenActionSettings' ||
    module.__typename === 'MultirecipientFeeCollectOpenActionSettings'
  ) {
    const endTimestamp = module?.endsAt;
    const amount = parseFloat(module?.amount?.value || '0');
    const currency = module?.amount?.asset?.symbol;
    const mints = getOpenActionCountByPublicationId(targetPublication.id);

    return (
      <div className="w-full space-y-1.5 text-left">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <GetOpenActionModuleIcon module={module} className="text-brand" />
            <b className="text-lg font-bold">
              {getOpenActionModuleData(module)?.name}
            </b>
          </div>
          <div className="space-x-1.5">
            {module.collectLimit ? (
              <b className="w-fit rounded-full bg-gray-500 px-3 py-0.5 text-xs text-white">
                {module.collectLimit || 0 - mints} left
              </b>
            ) : null}
            {module.referralFee ? (
              <b className="w-fit rounded-full bg-gradient-to-r from-green-500 to-green-600 px-3 py-0.5 text-xs text-white">
                {module.referralFee}% referral
              </b>
            ) : null}
          </div>
        </div>
        {amount ? (
          <div className="flex items-center space-x-1 text-sm">
            <img
              className="h-5 w-5"
              src={getTokenImage(currency)}
              alt={currency}
              title={currency}
            />
            <span>
              <b>{amount} </b>
              {currency}
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-sm">
            <img className="h-5 w-5" src={getTokenImage('WMATIC')} alt="Free" />
            <span>FREE</span>
          </div>
        )}
        {mints > 0 && (
          <div className="lt-text-gray-500">
            {mints} {plur('mint', mints)}
          </div>
        )}
        {endTimestamp ? (
          <div className="space-x-1.5 text-sm">
            <span>Sale Ends in</span>
            <span className="lt-text-gray-500">
              <CountdownTimer targetDate={endTimestamp} />
            </span>
          </div>
        ) : null}
      </div>
    );
  }

  return null;
};

export default CollectModulePreview;
