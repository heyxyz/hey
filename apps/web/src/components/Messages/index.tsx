import MetaTags from "@components/Common/MetaTags";
import { Leafwatch } from "@helpers/leafwatch";
import { loadKeys } from "@helpers/xmtp/keys";
import { InboxIcon } from "@heroicons/react/24/outline";
import { APP_NAME } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { PAGEVIEW } from "@hey/data/tracking";
import { EmptyState, H5 } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useFlag } from "@unleash/proxy-client-react";
import { useClient } from "@xmtp/react-sdk";
import type { NextPage } from "next";
import { useEffect } from "react";
import { useMessagesStore } from "src/store/non-persisted/useMessagesStore";
import { useAccount, useWalletClient } from "wagmi";
import StartConversation from "./Composer/StartConversation";
import Conversations from "./Conversations";
import MessagesList from "./MessagesList";

const Messages: NextPage = () => {
  const { newConversationAddress, selectedConversation } = useMessagesStore();
  const isStaff = useFlag(FeatureFlag.Staff);
  const { initialize, isLoading } = useClient();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: "messages" });
  }, []);

  const initXmtp = async () => {
    if (!address) {
      return;
    }

    const keys = loadKeys(address);
    if (!keys) {
      return;
    }

    return await initialize({
      keys,
      options: { env: "production" },
      signer: walletClient as any
    });
  };

  useEffect(() => {
    initXmtp();
  }, []);

  return (
    <div className="container mx-auto max-w-screen-xl grow px-0 sm:px-5">
      <div className="grid grid-cols-11">
        <MetaTags title={`Messages • ${APP_NAME}`} />
        <div className="col-span-11 border-x bg-white md:col-span-11 lg:col-span-4 dark:border-gray-700 dark:bg-black">
          <Conversations isClientLoading={isLoading} />
        </div>
        <div className="col-span-11 border-r bg-white md:col-span-11 lg:col-span-7 dark:border-gray-700 dark:bg-black">
          {newConversationAddress ? (
            <StartConversation />
          ) : selectedConversation ? (
            <MessagesList />
          ) : (
            <div
              className={cn(
                isStaff ? "h-[85vh] max-h-[85vh]" : "h-[87vh] max-h-[87vh]",
                "flex h-full items-center justify-center"
              )}
            >
              <EmptyState
                hideCard
                icon={<InboxIcon className="size-10" />}
                message={<H5>Select a conversation to start messaging</H5>}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
