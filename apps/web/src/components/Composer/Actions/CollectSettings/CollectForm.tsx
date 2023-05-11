import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { t, Trans } from '@lingui/macro';
import { CollectModules, useEnabledModulesQuery } from 'lens';
import isValidEthAddress from 'lib/isValidEthAddress';
import type { Dispatch, FC } from 'react';
import type { CollectModuleType } from 'src/store/collect-module';
import { useCollectModuleStore } from 'src/store/collect-module';
import { Button, ErrorMessage, Spinner } from 'ui';

import AmountConfig from './AmountConfig';
import CollectLimitConfig from './CollectLimitConfig';
import FollowersConfig from './FollowersConfig';
import ReferralConfig from './ReferralConfig';
import SplitConfig from './SplitConfig';
import TimeLimitConfig from './TimeLimitConfig';

interface CollectFormProps {
  setShowModal: Dispatch<boolean>;
}

const CollectForm: FC<CollectFormProps> = ({ setShowModal }) => {
  const amount = useCollectModuleStore((state) => state.amount);
  const recipients = useCollectModuleStore((state) => state.recipients);
  const reset = useCollectModuleStore((state) => state.reset);
  const collectModule = useCollectModuleStore((state) => state.collectModule);
  const setCollectModule = useCollectModuleStore(
    (state) => state.setCollectModule
  );

  const { RevertCollectModule, FreeCollectModule, SimpleCollectModule } =
    CollectModules;
  const splitTotal = recipients.reduce((acc, curr) => acc + curr.split, 0);
  const hasEmptyRecipients = recipients.some(
    (recipient) => !recipient.recipient
  );
  const hasInvalidEthAddressInRecipients = recipients.some(
    (recipient) =>
      recipient.recipient && !isValidEthAddress(recipient.recipient)
  );
  const isRecipientsDuplicated = () => {
    const recipientsSet = new Set(
      recipients.map((recipient) => recipient.recipient)
    );
    return recipientsSet.size !== recipients.length;
  };

  const setCollectType = (data: CollectModuleType) => {
    setCollectModule({
      ...collectModule,
      ...data
    });
  };

  const { error, data, loading } = useEnabledModulesQuery();

  if (loading) {
    return (
      <div className="space-y-2 px-5 py-3.5 text-center font-bold">
        <Spinner size="md" className="mx-auto" />
        <div>
          <Trans>Loading collect settings</Trans>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="p-5"
        title={t`Failed to load modules`}
        error={error}
      />
    );
  }

  const toggleCollect = () => {
    setCollectType({
      type:
        collectModule.type === RevertCollectModule
          ? SimpleCollectModule
          : RevertCollectModule,
      isFreeCollect: true
    });
  };

  return (
    <div className="space-y-3 p-5">
      {JSON.stringify(collectModule.type)}
      <ToggleWithHelper
        on={collectModule.type !== RevertCollectModule}
        setOn={toggleCollect}
        description={t`This post can be collected`}
      />
      {collectModule.type !== RevertCollectModule && (
        <div className="ml-5">
          <AmountConfig
            enabledModuleCurrencies={data?.enabledModuleCurrencies}
            setCollectType={setCollectType}
          />
          {collectModule.amount?.value ? (
            <>
              <ReferralConfig setCollectType={setCollectType} />
              <SplitConfig
                isRecipientsDuplicated={isRecipientsDuplicated}
                setCollectType={setCollectType}
              />
            </>
          ) : null}
          <CollectLimitConfig setCollectType={setCollectType} />
          <TimeLimitConfig setCollectType={setCollectType} />
          <FollowersConfig setCollectType={setCollectType} />
        </div>
      )}
      <div className="flex space-x-2 pt-5">
        <Button
          className="ml-auto"
          variant="danger"
          outline
          onClick={() => {
            reset();
            setShowModal(false);
          }}
        >
          <Trans>Cancel</Trans>
        </Button>
        <Button
          disabled={
            (parseFloat(amount as string) <= 0 &&
              collectModule.type !== FreeCollectModule) ||
            splitTotal > 100 ||
            hasEmptyRecipients ||
            hasInvalidEthAddressInRecipients ||
            isRecipientsDuplicated()
          }
          onClick={() => setShowModal(false)}
        >
          <Trans>Save</Trans>
        </Button>
      </div>
    </div>
  );
};

export default CollectForm;
