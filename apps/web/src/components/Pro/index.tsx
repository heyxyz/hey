import { Leafwatch } from "@helpers/leafwatch";
import { CheckIcon } from "@heroicons/react/24/outline";
import { APP_NAME, MONTHLY_PRO_PRICE } from "@hey/data/constants";
import { PAGEVIEW } from "@hey/data/tracking";
import formatDate from "@hey/helpers/datetime/formatDate";
import { H3, H4, H5 } from "@hey/ui";
import cn from "@hey/ui/cn";
import type { NextPage } from "next";
import { useEffect } from "react";
import { useProStore } from "src/store/non-persisted/useProStore";
import ExtendButton from "./ExtendButton";

const features = [
  "Extended Analytics",
  "Choose your app icon",
  "Set Profile Status",
  "Higher video and audio upload limits",
  "Pro Badge on your profile",
  "Early access to new features",
  "Priority support"
];

const Pro: NextPage = () => {
  const { proExpiresAt } = useProStore();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: "pro" });
  }, []);

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
        <H3 className="text-brand-500">Upgrade to Pro</H3>
        <H4 className="mt-4">
          Enjoy an enhanced experience of {APP_NAME}, exclusive creator tools,
          and more.
        </H4>
      </div>
      <H5 className="ld-text-gray-500 mx-auto mt-4 max-w-2xl text-center font-normal leading-7">
        You can extend your Pro subscription anytime for an additional month or
        given time, whenever it suits you, without any hassle.
      </H5>
      <div className="mx-auto mt-20 max-w-md items-center space-y-6">
        <div
          className={cn(
            "relative bg-white shadow-2xl dark:bg-black",
            "rounded-2xl p-8 ring-1 ring-gray-900/10 sm:p-10 dark:ring-gray-100/20"
          )}
        >
          <p className="flex items-baseline space-x-3">
            <span className="font-bold text-5xl text-gray-900 tracking-tight dark:text-white">
              ${MONTHLY_PRO_PRICE}
            </span>
            <span className="ld-text-gray-500">/month</span>
          </p>
          <p className="ld-text-gray-500 mt-3">Billed monthly</p>
          <ul className="ld-text-gray-500 mt-5 space-y-1 text-sm">
            {features.map((feature) => (
              <li className="flex items-center space-x-3" key={feature}>
                <CheckIcon aria-hidden="true" className="size-5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          {proExpiresAt && (
            <div className="mt-6 mb-2 text-sm">
              Your Pro expires at <b>{formatDate(proExpiresAt)}</b>
            </div>
          )}
          <ExtendButton />
        </div>
      </div>
    </div>
  );
};

export default Pro;
