import LicensePicker from "@components/Composer/LicensePicker";
import ToggleWithHelper from "@components/Shared/ToggleWithHelper";
import type { CollectActionType } from "@hey/types/hey";
import { Button } from "@hey/ui";
import type { Dispatch, FC, SetStateAction } from "react";
import { useCollectActionStore } from "src/store/non-persisted/post/useCollectActionStore";
import { usePostLicenseStore } from "src/store/non-persisted/post/usePostLicenseStore";
import { isAddress } from "viem";
import AmountConfig from "./AmountConfig";
import CollectLimitConfig from "./CollectLimitConfig";
import FollowersConfig from "./FollowersConfig";
import ReferralConfig from "./ReferralConfig";
import SplitConfig from "./SplitConfig";
import TimeLimitConfig from "./TimeLimitConfig";

interface CollectFormProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const CollectForm: FC<CollectFormProps> = ({ setShowModal }) => {
  const { collectAction, reset, setCollectAction } = useCollectActionStore(
    (state) => state
  );
  const { setLicense } = usePostLicenseStore();

  const recipients = collectAction.recipients || [];
  const splitTotal = recipients.reduce((acc, curr) => acc + curr.percent, 0);

  const hasEmptyRecipients = recipients.some((recipient) => !recipient.address);
  const hasInvalidEthAddressInRecipients = recipients.some(
    (recipient) => recipient.address && !isAddress(recipient.address)
  );
  const hasZeroSplits = recipients.some((recipient) => recipient.percent === 0);
  const hasImproperSplits = recipients.length > 1 && splitTotal !== 100;

  const isRecipientsDuplicated = () => {
    const recipientsSet = new Set(
      recipients.map((recipient) => recipient.address)
    );
    return recipientsSet.size !== recipients.length;
  };

  const setCollectType = (data: CollectActionType) => {
    setCollectAction({
      ...collectAction,
      ...data
    });
  };

  const toggleCollect = () => {
    if (collectAction.enabled) {
      setLicense(null);
      reset();
    } else {
      setCollectType({ enabled: true });
    }
  };

  return (
    <>
      <div className="p-5">
        <ToggleWithHelper
          description="This post can be collected"
          heading="Enable Collect"
          on={collectAction.enabled || false}
          setOn={toggleCollect}
        />
      </div>
      <div className="divider" />
      {collectAction.enabled ? (
        <>
          <div className="m-5">
            <AmountConfig setCollectType={setCollectType} />
            {collectAction.amount?.value ? (
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
          <div className="divider" />
          <div className="m-5">
            <LicensePicker />
          </div>
          <div className="divider" />
        </>
      ) : null}
      <div className="flex space-x-2 p-5">
        <Button
          className="ml-auto"
          onClick={() => {
            setShowModal(false);
            setLicense(null);
            reset();
          }}
          outline
          variant="danger"
        >
          {collectAction.enabled ? "Reset" : "Cancel"}
        </Button>
        <Button
          disabled={
            (Number.parseFloat(collectAction.amount?.value as string) <= 0 &&
              collectAction.enabled) ||
            hasImproperSplits ||
            hasEmptyRecipients ||
            hasZeroSplits ||
            hasInvalidEthAddressInRecipients ||
            isRecipientsDuplicated()
          }
          onClick={() => setShowModal(false)}
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default CollectForm;
