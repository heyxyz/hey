import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { Button } from '@components/UI/Button';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Input } from '@components/UI/Input';
import { Spinner } from '@components/UI/Spinner';
import { CollectionIcon, UserGroupIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { t, Trans } from '@lingui/macro';
import type { Erc20 } from 'lens';
import { CollectModules, useEnabledModulesQuery } from 'lens';
import type { Dispatch, FC } from 'react';
import { useEffect } from 'react';
import { useAccessSettingsStore } from 'src/store/access-settings';
import { useAppStore } from 'src/store/app';
import { useCollectModuleStore } from 'src/store/collect-module';
import { PUBLICATION } from 'src/tracking';

import CollectLimitConfig from './CollectLimitConfig';
import ReferralConfig from './ReferralConfig';
import SplitConfig from './SplitConfig';
import TimeLimitConfig from './TimeLimitConfig';

interface Props {
  setShowModal: Dispatch<boolean>;
}

const CollectForm: FC<Props> = ({ setShowModal }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const selectedCollectModule = useCollectModuleStore((state) => state.selectedCollectModule);
  const setSelectedCollectModule = useCollectModuleStore((state) => state.setSelectedCollectModule);
  const amount = useCollectModuleStore((state) => state.amount);
  const setAmount = useCollectModuleStore((state) => state.setAmount);
  const selectedCurrency = useCollectModuleStore((state) => state.selectedCurrency);
  const setSelectedCurrency = useCollectModuleStore((state) => state.setSelectedCurrency);
  const referralFee = useCollectModuleStore((state) => state.referralFee);
  const setReferralFee = useCollectModuleStore((state) => state.setReferralFee);
  const collectLimit = useCollectModuleStore((state) => state.collectLimit);
  const setCollectLimit = useCollectModuleStore((state) => state.setCollectLimit);
  const hasTimeLimit = useCollectModuleStore((state) => state.hasTimeLimit);
  const setHasTimeLimit = useCollectModuleStore((state) => state.setHasTimeLimit);
  const recipients = useCollectModuleStore((state) => state.recipients);
  const setRecipients = useCollectModuleStore((state) => state.setRecipients);
  const followerOnly = useCollectModuleStore((state) => state.followerOnly);
  const setFollowerOnly = useCollectModuleStore((state) => state.setFollowerOnly);
  const setPayload = useCollectModuleStore((state) => state.setPayload);
  const reset = useCollectModuleStore((state) => state.reset);
  const setCollectToView = useAccessSettingsStore((state) => state.setCollectToView);

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

  useEffect(() => {
    const baseFeeData = {
      amount: {
        currency: selectedCurrency,
        value: amount
      },
      [hasRecipients ? 'recipients' : 'recipient']: hasRecipients ? recipients : currentProfile?.ownedBy,
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
              endTimestamp: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()
            })
          }
        });
        break;
      default:
        setPayload({ revertCollectModule: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, referralFee, collectLimit, hasTimeLimit, followerOnly, selectedCollectModule]);

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
      <div className="space-y-2 py-3.5 px-5 text-center font-bold">
        <Spinner size="md" className="mx-auto" />
        <div>
          <Trans>Loading collect settings</Trans>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage className="p-5" title={t`Failed to load modules`} error={error} />;
  }

  const toggleCollect = () => {
    Mixpanel.track(PUBLICATION.NEW.COLLECT_MODULE.TOGGLE_COLLECT_MODULE);
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
          <div className="pt-3">
            <ToggleWithHelper
              on={Boolean(amount)}
              setOn={() => {
                setAmount(amount ? null : '1');
                setRecipients([]);
                Mixpanel.track(PUBLICATION.NEW.COLLECT_MODULE.TOGGLE_CHARGE_FOR_COLLECT);
              }}
              heading={t`Charge for collecting`}
              description={t`Get paid whenever someone collects your post`}
              icon={<CollectionIcon className="h-4 w-4" />}
            />
            {amount ? (
              <div className="pt-4">
                <div className="flex space-x-2 text-sm">
                  <Input
                    label={t`Price`}
                    type="number"
                    placeholder="0.5"
                    min="0"
                    max="100000"
                    value={parseFloat(amount)}
                    onChange={(event) => {
                      setAmount(event.target.value ? event.target.value : '0');
                    }}
                  />
                  <div>
                    <div className="label">
                      <Trans>Select Currency</Trans>
                    </div>
                    <select
                      className="focus:border-brand-500 focus:ring-brand-400 w-full rounded-xl border border-gray-300 bg-white outline-none disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800"
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                    >
                      {data?.enabledModuleCurrencies.map((currency: Erc20) => (
                        <option
                          key={currency.address}
                          value={currency.address}
                          selected={currency?.address === selectedCurrency}
                        >
                          {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <ReferralConfig />
              </div>
            ) : null}
          </div>
          {selectedCollectModule !== FreeCollectModule && amount && (
            <>
              <CollectLimitConfig />
              <TimeLimitConfig />
              <SplitConfig />
            </>
          )}
          <div className="pt-5">
            <ToggleWithHelper
              on={followerOnly}
              setOn={() => {
                setFollowerOnly(!followerOnly);
                Mixpanel.track(PUBLICATION.NEW.COLLECT_MODULE.TOGGLE_FOLLOWERS_ONLY_COLLECT);
              }}
              heading={t`Who can collect`}
              description={t`Only followers can collect`}
              icon={<UserGroupIcon className="h-4 w-4" />}
            />
          </div>
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
        <Button disabled={splitTotal > 100} onClick={() => setShowModal(false)}>
          <Trans>Save</Trans>
        </Button>
      </div>
    </div>
  );
};

export default CollectForm;
