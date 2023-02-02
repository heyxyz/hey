import { Button } from '@components/UI/Button';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Input } from '@components/UI/Input';
import { Spinner } from '@components/UI/Spinner';
import { Toggle } from '@components/UI/Toggle';
import {
  ClockIcon,
  CollectionIcon,
  StarIcon,
  SwitchHorizontalIcon,
  UserGroupIcon
} from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import { t, Trans } from '@lingui/macro';
import type { Erc20 } from 'lens';
import { CollectModules, useEnabledModulesQuery } from 'lens';
import type { Dispatch, FC } from 'react';
import { useEffect } from 'react';
import { useAccessSettingsStore } from 'src/store/access-settings';
import { useAppStore } from 'src/store/app';
import { useCollectModuleStore } from 'src/store/collect-module';
import { PUBLICATION } from 'src/tracking';

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
    TimedFeeCollectModule
  } = CollectModules;

  useEffect(() => {
    const baseFeeData = {
      amount: {
        currency: selectedCurrency,
        value: amount
      },
      recipient: currentProfile?.ownedBy,
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
      default:
        setPayload({ revertCollectModule: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, referralFee, collectLimit, hasTimeLimit, followerOnly, selectedCollectModule]);

  useEffect(() => {
    if (hasTimeLimit) {
      if (amount) {
        setSelectedCollectModule(collectLimit ? LimitedTimedFeeCollectModule : TimedFeeCollectModule);
      } else {
        setHasTimeLimit(false);
        setSelectedCollectModule(collectLimit ? LimitedTimedFeeCollectModule : FreeCollectModule);
      }
    } else {
      if (amount) {
        setSelectedCollectModule(collectLimit ? LimitedFeeCollectModule : FeeCollectModule);
      } else {
        setCollectLimit(null);
        setSelectedCollectModule(collectLimit ? LimitedFeeCollectModule : FreeCollectModule);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, collectLimit, hasTimeLimit]);

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
    Analytics.track(PUBLICATION.NEW.COLLECT_MODULE.TOGGLE_COLLECT_MODULE);
    if (selectedCollectModule === RevertCollectModule) {
      return setSelectedCollectModule(FreeCollectModule);
    } else {
      reset();
      return setSelectedCollectModule(RevertCollectModule);
    }
  };

  return (
    <div className="space-y-3 p-5">
      <div className="flex items-center space-x-2">
        <Toggle on={selectedCollectModule !== RevertCollectModule} setOn={toggleCollect} />
        <div className="lt-text-gray-500 text-sm font-bold">
          <Trans>This post can be collected</Trans>
        </div>
      </div>
      {selectedCollectModule !== RevertCollectModule && (
        <div className="ml-5">
          <div className="space-y-2 pt-3">
            <div className="flex items-center space-x-2">
              <CollectionIcon className="text-brand-500 h-4 w-4" />
              <span>
                <Trans>Charge for collecting</Trans>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Toggle
                on={Boolean(amount)}
                setOn={() => {
                  setAmount(amount ? null : '0');
                  Analytics.track(PUBLICATION.NEW.COLLECT_MODULE.TOGGLE_CHARGE_FOR_COLLECT);
                }}
              />
              <div className="lt-text-gray-500 text-sm font-bold">
                <Trans>Get paid whenever someone collects your post</Trans>
              </div>
            </div>
            {amount ? (
              <div className="pt-2">
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
                <div className="space-y-2 pt-5">
                  <div className="flex items-center space-x-2">
                    <SwitchHorizontalIcon className="text-brand-500 h-4 w-4" />
                    <span>
                      <Trans>Mirror referral reward</Trans>
                    </span>
                  </div>
                  <div className="lt-text-gray-500 text-sm font-bold">
                    <Trans>Share your collect fee with people who amplify your content</Trans>
                  </div>
                  <div className="flex space-x-2 pt-2 text-sm">
                    <Input
                      label={t`Referral fee`}
                      type="number"
                      placeholder="5"
                      iconRight="%"
                      min="0"
                      max="100"
                      value={parseFloat(referralFee ?? '0')}
                      onChange={(event) => {
                        setReferralFee(event.target.value ? event.target.value : '0');
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          {selectedCollectModule !== FreeCollectModule && amount && (
            <>
              <div className="space-y-2 pt-5">
                <div className="flex items-center space-x-2">
                  <StarIcon className="text-brand-500 h-4 w-4" />
                  <span>
                    <Trans>Limited edition</Trans>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Toggle
                    on={Boolean(collectLimit)}
                    setOn={() => {
                      setCollectLimit(collectLimit ? null : '1');
                      Analytics.track(PUBLICATION.NEW.COLLECT_MODULE.TOGGLE_LIMITED_EDITION_COLLECT);
                    }}
                  />
                  <div className="lt-text-gray-500 text-sm font-bold">
                    <Trans>Make the collects exclusive</Trans>
                  </div>
                </div>
                {collectLimit ? (
                  <div className="flex space-x-2 pt-2 text-sm">
                    <Input
                      label={t`Collect limit`}
                      type="number"
                      placeholder="5"
                      min="1"
                      max="100000"
                      value={parseFloat(collectLimit)}
                      onChange={(event) => {
                        setCollectLimit(event.target.value ? event.target.value : '1');
                      }}
                    />
                  </div>
                ) : null}
              </div>
              <div className="space-y-2 pt-5">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="text-brand-500 h-4 w-4" />
                  <span>
                    <Trans>Time limit</Trans>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Toggle
                    on={hasTimeLimit}
                    setOn={() => {
                      setHasTimeLimit(!hasTimeLimit);
                      Analytics.track(PUBLICATION.NEW.COLLECT_MODULE.TOGGLE_TIME_LIMIT_COLLECT);
                    }}
                  />
                  <div className="lt-text-gray-500 text-sm font-bold">
                    <Trans>Limit collecting to the first 24h</Trans>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="space-y-2 pt-5">
            <div className="flex items-center space-x-2">
              <UserGroupIcon className="text-brand-500 h-4 w-4" />
              <span>
                <Trans>Who can collect</Trans>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Toggle
                on={followerOnly}
                setOn={() => {
                  setFollowerOnly(!followerOnly);
                  Analytics.track(PUBLICATION.NEW.COLLECT_MODULE.TOGGLE_FOLLOWERS_ONLY_COLLECT);
                }}
              />
              <div className="lt-text-gray-500 text-sm font-bold">
                <Trans>Only followers can collect</Trans>
              </div>
            </div>
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
        <Button onClick={() => setShowModal(false)}>
          <Trans>Save</Trans>
        </Button>
      </div>
    </div>
  );
};

export default CollectForm;
