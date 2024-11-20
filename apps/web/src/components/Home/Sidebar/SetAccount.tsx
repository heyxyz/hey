import { Leafwatch } from "@helpers/leafwatch";
import { MinusCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { APP_NAME } from "@hey/data/constants";
import { ONBOARDING } from "@hey/data/tracking";
import { Card, H5 } from "@hey/ui";
import Link from "next/link";
import type { FC } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";

interface StatusProps {
  finished: boolean;
  title: string;
}

const Status: FC<StatusProps> = ({ finished, title }) => (
  <div className="flex items-center space-x-1.5">
    {finished ? (
      <CheckCircleIcon className="size-5" />
    ) : (
      <MinusCircleIcon className="size-5" />
    )}
    <div className="ld-text-gray-500">{title}</div>
  </div>
);

const SetAccount: FC = () => {
  const { currentAccount } = useAccountStore();
  const { email, loading } = usePreferencesStore();

  const doneSetup =
    Boolean(currentAccount?.metadata?.displayName) &&
    Boolean(currentAccount?.metadata?.bio) &&
    Boolean(currentAccount?.metadata?.picture) &&
    Boolean(currentAccount?.interests?.length) &&
    Boolean(loading || email);

  if (doneSetup) {
    return null;
  }

  return (
    <Card as="aside" className="mb-4 space-y-4 p-5">
      <H5>Setup your {APP_NAME} profile</H5>
      <div className="space-y-1 text-sm leading-5">
        <Status
          finished={Boolean(currentAccount?.metadata?.displayName)}
          title="Set profile name"
        />
        <Status
          finished={Boolean(currentAccount?.metadata?.bio)}
          title="Set profile bio"
        />
        <Status
          finished={Boolean(currentAccount?.metadata?.picture)}
          title="Set your avatar"
        />
        <div>
          <Link
            href="/settings/account"
            onClick={() => Leafwatch.track(ONBOARDING.NAVIGATE_UPDATE_EMAIL)}
          >
            <Status finished={Boolean(email)} title="Set your email address" />
          </Link>
        </div>
        <div>
          <Link
            href="/settings/interests"
            onClick={() =>
              Leafwatch.track(ONBOARDING.NAVIGATE_UPDATE_PROFILE_INTERESTS)
            }
          >
            <Status
              finished={Boolean(currentAccount?.interests?.length)}
              title="Select profile interests"
            />
          </Link>
        </div>
      </div>
      <div className="font-bold">
        <Link
          href="/settings"
          onClick={() => Leafwatch.track(ONBOARDING.NAVIGATE_UPDATE_PROFILE)}
        >
          Update profile now
        </Link>
      </div>
    </Card>
  );
};

export default SetAccount;
