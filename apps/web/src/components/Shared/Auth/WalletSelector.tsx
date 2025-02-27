import { KeyIcon } from "@heroicons/react/24/outline";
import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { useModal } from "connectkit";
import Link from "next/link";
import type { FC } from "react";
import { useAccount, useDisconnect } from "wagmi";

const WalletSelector: FC = () => {
  const { setOpen } = useModal();
  const { disconnect } = useDisconnect();
  const { connector: activeConnector } = useAccount();

  return activeConnector?.id ? (
    <div className="space-y-2.5">
      <button
        className="flex items-center space-x-1 text-sm underline"
        onClick={() => disconnect?.()}
        type="reset"
      >
        <KeyIcon className="size-4" />
        <div>Change wallet</div>
      </button>
    </div>
  ) : (
    <div className="inline-block w-full space-y-3 overflow-hidden text-left align-middle">
      <button
        className="flex w-full items-center justify-between space-x-2.5 overflow-hidden rounded-xl border px-4 py-3 outline-none hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
        onClick={() => setOpen(true)}
        type="button"
      >
        Connect Wallet
        <img
          alt="Family"
          className="size-6"
          src={`${STATIC_IMAGES_URL}/brands/family.png`}
        />
      </button>
      <div className="linkify text-gray-500 text-sm">
        By connecting wallet, you agree to our{" "}
        <Link href="/terms" target="_blank">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" target="_blank">
          Policy
        </Link>
        .
      </div>
    </div>
  );
};

export default WalletSelector;
