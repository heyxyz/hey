import type { NextPage } from "next";

import errorToast from "@helpers/errorToast";
import { CheckIcon } from "@heroicons/react/24/outline";
import { APP_NAME, STATIC_IMAGES_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import { Button } from "@hey/ui";
import { useState } from "react";
import toast from "react-hot-toast";
import useHandleWrongNetwork from "src/hooks/useHandleWrongNetwork";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const features = [
  "Choose your app icon",
  "Pro Badge on your profile",
  "Exclusive access to Hey Groups",
  "Early access to new features",
  "Priority support"
];

const Pro: NextPage = () => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const [isLoading, setIsLoading] = useState(false);
  const handleWrongNetwork = useHandleWrongNetwork();

  const upgrade = async () => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      await handleWrongNetwork();
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <div className="px-6 py-20">
      <div className="-z-10 absolute inset-x-0 blur-3xl">
        <div
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-brand-300 to-purple-300 opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
          }}
        />
      </div>
      <div className="text-center font-bold">
        <h2 className="text-2xl text-brand-500 sm:text-3xl">Upgrade to Pro</h2>
        <p className="mt-4 text-lg sm:text-xl">
          Enjoy an enhanced experience of {APP_NAME}, exclusive tools, and more.
        </p>
      </div>
      <p className="ld-text-gray-500 mx-auto mt-4 max-w-2xl text-center text-lg leading-7">
        You can extend your Pro subscription anytime for an additional month,
        whenever it suits you, without any hassle.
      </p>
      <div className="mx-auto mt-16 items-center space-y-6 sm:mt-20 sm:space-y-0 lg:max-w-sm">
        <div className="rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-gray-900/10 sm:p-10 dark:bg-black dark:ring-gray-100/20">
          <p className="flex items-baseline space-x-3">
            <img
              alt="wGHO"
              className="size-8"
              src={`${STATIC_IMAGES_URL}/tokens/gho.svg`}
            />
            <b className="text-5xl text-gray-900 dark:text-white">5</b>
            <span className="ld-text-gray-500">/month</span>
          </p>
          <p className="ld-text-gray-500 mt-6">Billed monthly</p>
          <ul className="ld-text-gray-500 mt-8 space-y-1 text-sm sm:mt-10">
            {features.map((feature) => (
              <li className="flex items-center space-x-3" key={feature}>
                <CheckIcon aria-hidden="true" className="size-5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            className="mt-3 w-full"
            disabled={isLoading}
            onClick={upgrade}
            size="lg"
          >
            Upgrade to Pro
          </Button>
          {isLoading ? (
            <Button
              className="mt-3 w-full"
              disabled={isLoading}
              onClick={upgrade}
              outline
              size="lg"
              variant="danger"
            >
              Cancel Subscription
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Pro;
