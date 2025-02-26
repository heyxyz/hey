import { MinusCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { APP_NAME } from "@hey/data/constants";
import { Card, H5 } from "@hey/ui";
import Link from "next/link";
import type { FC } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";

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

  const doneSetup =
    Boolean(currentAccount?.metadata?.name) &&
    Boolean(currentAccount?.metadata?.bio) &&
    Boolean(currentAccount?.metadata?.picture);

  if (doneSetup) {
    return null;
  }

  return (
    <Card as="aside" className="mb-4 space-y-4 p-5">
      <H5>Setup your {APP_NAME} account</H5>
      <div className="space-y-1 text-sm leading-5">
        <Status
          finished={Boolean(currentAccount?.metadata?.name)}
          title="Set account name"
        />
        <Status
          finished={Boolean(currentAccount?.metadata?.bio)}
          title="Set account bio"
        />
        <Status
          finished={Boolean(currentAccount?.metadata?.picture)}
          title="Set your avatar"
        />
      </div>
      <div className="font-bold">
        <Link href="/settings">Update account now</Link>
      </div>
    </Card>
  );
};

export default SetAccount;
