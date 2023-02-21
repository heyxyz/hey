import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { Button } from '@components/UI/Button';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Input } from '@components/UI/Input';
import { Spinner } from '@components/UI/Spinner';
import {
  ClockIcon,
  CollectionIcon,
  PlusIcon,
  StarIcon,
  SwitchHorizontalIcon,
  UserGroupIcon,
  UsersIcon,
  XCircleIcon
} from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import splitNumber from '@lib/splitNumber';
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
        setPayload({ multirecipientFeeCollectModule: { ...baseFeeData } });
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
      reset();
      return setSelectedCollectModule(RevertCollectModule);
    }
  };

  const splitEvenly = () => {
    const equalSplits = splitNumber(100, recipients.length);
    const splits = recipients.map((recipient, i) => {
      return {
        recipient: recipient.recipient,
        split: equalSplits[i]
      };
    });
    setRecipients([...splits]);
  };

  return (
    <div className="space-y-3 p-5">
      <ToggleWithHelper
        on={selectedCollectModule !== RevertCollectModule}
        setOn={toggleCollect}
        label={t`This post can be collected`}
      />
      {selectedCollectModule !== RevertCollectModule && (
        <div className="ml-5">
          <div className="space-y-2 pt-3">
            <div className="flex items-center space-x-2">
              <CollectionIcon className="text-brand-500 h-4 w-4" />
              <span>
                <Trans>Charge for collecting</Trans>
              </span>
            </div>
            <ToggleWithHelper
              on={Boolean(amount)}
              setOn={() => {
                setAmount(amount ? null : '0');
                setRecipients([]);
                Mixpanel.track(PUBLICATION.NEW.COLLECT_MODULE.TOGGLE_CHARGE_FOR_COLLECT);
              }}
              label={t`Get paid whenever someone collects your post`}
            />
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
                <ToggleWithHelper
                  on={Boolean(collectLimit)}
                  setOn={() => {
                    setCollectLimit(collectLimit ? null : '1');
                    Mixpanel.track(PUBLICATION.NEW.COLLECT_MODULE.TOGGLE_LIMITED_EDITION_COLLECT);
                  }}
                  label={t`Make the collects exclusive`}
                />
                {collectLimit ? (
                  <div className="pt-2 text-sm">
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
                <ToggleWithHelper
                  on={hasTimeLimit}
                  setOn={() => {
                    setHasTimeLimit(!hasTimeLimit);
                    Mixpanel.track(PUBLICATION.NEW.COLLECT_MODULE.TOGGLE_TIME_LIMIT_COLLECT);
                  }}
                  label={t`Limit collecting to the first 24h`}
                />
              </div>
              <div className="space-y-2 pt-5">
                <div className="flex items-center space-x-2">
                  <UsersIcon className="text-brand-500 h-4 w-4" />
                  <span>
                    <Trans>Split revenue</Trans>
                  </span>
                </div>
                <ToggleWithHelper
                  on={recipients.length > 0}
                  setOn={() => {
                    if (recipients.length > 0) {
                      setRecipients([]);
                    } else {
                      setRecipients([{ recipient: currentProfile?.ownedBy, split: 100 }]);
                    }
                    Mixpanel.track(PUBLICATION.NEW.COLLECT_MODULE.TOGGLE_MULTIPLE_RECIPIENTS_COLLECT);
                  }}
                  label={t`Set multiple recipients for the collect fee`}
                />
                {hasRecipients ? (
                  <div className="space-y-3">
                    <div className="no-scrollbar max-h-[20vh] overflow-auto">
                      {recipients.map((recipient, index) => (
                        <div key={index} className="flex items-center space-x-2 py-2 pt-2 text-sm">
                          <Input
                            placeholder="0x1234..."
                            value={recipient.recipient}
                            disabled={index === 0}
                            onChange={(event) => {
                              setRecipients(
                                recipients.map((r, i) => {
                                  if (i === index) {
                                    return { ...r, recipient: event.target.value };
                                  }
                                  return r;
                                })
                              );
                            }}
                          />
                          <div className="w-1/3">
                            <Input
                              type="number"
                              placeholder="5"
                              min="1"
                              max="100"
                              value={recipient.split}
                              iconRight="%"
                              onChange={(event) => {
                                setRecipients(
                                  recipients.map((r, i) => {
                                    if (i === index) {
                                      return { ...r, split: parseInt(event.target.value) };
                                    }
                                    return r;
                                  })
                                );
                              }}
                            />
                          </div>
                          <button
                            onClick={() => {
                              setRecipients(recipients.filter((_, i) => i !== index));
                            }}
                          >
                            <XCircleIcon className="h-5 w-5 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <Button
                        size="sm"
                        outline
                        icon={<PlusIcon className="h-3 w-3" />}
                        onClick={() => {
                          setRecipients([...recipients, { recipient: '', split: 0 }]);
                        }}
                      >
                        Add recipient
                      </Button>
                      <Button
                        size="sm"
                        outline
                        icon={<SwitchHorizontalIcon className="h-3 w-3" />}
                        onClick={splitEvenly}
                      >
                        Split evenly
                      </Button>
                    </div>
                    {recipients.reduce((acc, curr) => acc + curr.split, 0) > 100 ? (
                      <div className="text-sm font-bold text-red-500">
                        <Trans>
                          Splits cannot exceed 100%. Total:
                          <span> {recipients.reduce((acc, curr) => acc + curr.split, 0)}</span>%
                        </Trans>
                      </div>
                    ) : null}
                  </div>
                ) : null}
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
            <ToggleWithHelper
              on={followerOnly}
              setOn={() => {
                setFollowerOnly(!followerOnly);
                Mixpanel.track(PUBLICATION.NEW.COLLECT_MODULE.TOGGLE_FOLLOWERS_ONLY_COLLECT);
              }}
              label={t`Only followers can collect`}
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
        <Button onClick={() => setShowModal(false)}>
          <Trans>Save</Trans>
        </Button>
      </div>
    </div>
  );
};

export default CollectForm;
