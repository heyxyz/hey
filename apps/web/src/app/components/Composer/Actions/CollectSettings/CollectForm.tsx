'use client';
import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { getTimeAddedNDay } from '@lib/formatTime';
import { t, Trans } from '@lingui/macro';
import { CollectModules, useEnabledModulesQuery } from 'lens';
import isValidEthAddress from 'lib/isValidEthAddress';
import type { Dispatch, FC } from 'react';
import { useEffect } from 'react';
import { useAccessSettingsStore } from 'src/store/access-settings';
import { useAppStore } from 'src/store/app';
import { useCollectModuleStore } from 'src/store/collect-module';
import { Button, ErrorMessage, Spinner } from 'ui';

import AmountConfig from './AmountConfig';
import CollectLimitConfig from './CollectLimitConfig';
import FollowersConfig from './FollowersConfig';
import SplitConfig from './SplitConfig';
import TimeLimitConfig from './TimeLimitConfig';

interface CollectFormProps {
  setShowModal: Dispatch<boolean>;
}

const CollectForm: FC<CollectFormProps> = ({ setShowModal }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const selectedCollectModule = useCollectModuleStore(
    (state) => state.selectedCollectModule
  );
  const setSelectedCollectModule = useCollectModuleStore(
    (state) => state.setSelectedCollectModule
  );
  const amount = useCollectModuleStore((state) => state.amount);
  const selectedCurrency = useCollectModuleStore(
    (state) => state.selectedCurrency
  );
  const referralFee = useCollectModuleStore((state) => state.referralFee);
  const collectLimit = useCollectModuleStore((state) => state.collectLimit);
  const setCollectLimit = useCollectModuleStore(
    (state) => state.setCollectLimit
  );
  const hasTimeLimit = useCollectModuleStore((state) => state.hasTimeLimit);
  const setHasTimeLimit = useCollectModuleStore(
    (state) => state.setHasTimeLimit
  );
  const recipients = useCollectModuleStore((state) => state.recipients);
  const followerOnly = useCollectModuleStore((state) => state.followerOnly);
  const setPayload = useCollectModuleStore((state) => state.setPayload);
  const reset = useCollectModuleStore((state) => state.reset);
  const setCollectToView = useAccessSettingsStore(
    (state) => state.setCollectToView
  );

  const {
    RevertCollectModule,
    FreeCollectModule,
    FeeCollectModule,
    LimitedFeeCollectModule,
    LimitedTimedFeeCollectModule,
    TimedFeeCollectModule,
    MultirecipientFeeCollectModule
  } = CollectModules;
  const hasRecipients = recipients.length > 0;
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

  useEffect(() => {
    const baseFeeData = {
      amount: {
        currency: selectedCurrency,
        value: amount
      },
      [hasRecipients ? 'recipients' : 'recipient']: hasRecipients
        ? recipients
        : currentProfile?.ownedBy,
      referralFee: parseFloat(referralFee ?? '0'),
      followerOnly
    };

    switch (selectedCollectModule) {
      case RevertCollectModule:
        setCollectToView(false);
        setPayload({ revertCollectModule: true });
        break;
      case FreeCollectModule:
        setPayload({ freeCollectModule: { followerOnly } });
        break;
      case FeeCollectModule:
        setPayload({
          feeCollectModule: { ...baseFeeData }
        });
        break;
      case LimitedFeeCollectModule:
      case LimitedTimedFeeCollectModule:
        setPayload({
          [selectedCollectModule === LimitedFeeCollectModule
            ? 'limitedFeeCollectModule'
            : 'limitedTimedFeeCollectModule']: {
            ...baseFeeData,
            collectLimit
          }
        });
        break;
      case TimedFeeCollectModule:
        setPayload({ timedFeeCollectModule: { ...baseFeeData } });
        break;
      case MultirecipientFeeCollectModule:
        setPayload({
          multirecipientFeeCollectModule: {
            ...baseFeeData,
            ...(collectLimit && { collectLimit }),
            ...(hasTimeLimit && {
              endTimestamp: getTimeAddedNDay(1)
            })
          }
        });
        break;
      default:
        setPayload({ revertCollectModule: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    amount,
    referralFee,
    collectLimit,
    hasTimeLimit,
    followerOnly,
    recipients,
    selectedCollectModule
  ]);

  useEffect(() => {
    if (hasTimeLimit) {
      if (amount) {
        if (collectLimit) {
          if (hasRecipients) {
            setSelectedCollectModule(MultirecipientFeeCollectModule);
          } else {
            setSelectedCollectModule(LimitedTimedFeeCollectModule);
          }
        } else {
          if (hasRecipients) {
            setSelectedCollectModule(MultirecipientFeeCollectModule);
          } else {
            setSelectedCollectModule(TimedFeeCollectModule);
          }
        }
      } else {
        setHasTimeLimit(false);
        if (collectLimit) {
          if (hasRecipients) {
            setSelectedCollectModule(MultirecipientFeeCollectModule);
          } else {
            setSelectedCollectModule(LimitedFeeCollectModule);
          }
        } else {
          setSelectedCollectModule(FreeCollectModule);
        }
      }
    } else {
      if (amount) {
        if (collectLimit) {
          if (hasRecipients) {
            setSelectedCollectModule(MultirecipientFeeCollectModule);
          } else {
            setSelectedCollectModule(LimitedFeeCollectModule);
          }
        } else {
          if (hasRecipients) {
            setSelectedCollectModule(MultirecipientFeeCollectModule);
          } else {
            setSelectedCollectModule(FeeCollectModule);
          }
        }
      } else {
        setCollectLimit(null);
        if (collectLimit) {
          if (hasRecipients) {
            setSelectedCollectModule(MultirecipientFeeCollectModule);
          } else {
            setSelectedCollectModule(LimitedFeeCollectModule);
          }
        } else {
          setSelectedCollectModule(FreeCollectModule);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, collectLimit, hasTimeLimit, recipients]);

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
    if (selectedCollectModule === RevertCollectModule) {
      return setSelectedCollectModule(FreeCollectModule);
    } else {
      return reset();
    }
  };

  return (
    <div className="space-y-3 p-5">
      <ToggleWithHelper
        on={selectedCollectModule !== RevertCollectModule}
        setOn={toggleCollect}
        description={t`This post can be collected`}
      />
      {selectedCollectModule !== RevertCollectModule && (
        <div className="ml-5">
          <AmountConfig
            enabledModuleCurrencies={data?.enabledModuleCurrencies}
          />
          {selectedCollectModule !== FreeCollectModule && amount && (
            <>
              <CollectLimitConfig />
              <TimeLimitConfig />
              <SplitConfig isRecipientsDuplicated={isRecipientsDuplicated} />
            </>
          )}
          <FollowersConfig />
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
              selectedCollectModule !== FreeCollectModule) ||
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
