import LazyDefaultProfile from "@components/Shared/LazyDefaultProfile";
import { FeatureFlag } from "@hey/data/feature-flags";
import cn from "@hey/ui/cn";
import { useFlag } from "@unleash/proxy-client-react";
import type { CachedConversation } from "@xmtp/react-sdk";
import { useMessages } from "@xmtp/react-sdk";
import type { FC } from "react";
import { useEffect, useRef } from "react";
import { useMessagesStore } from "src/store/non-persisted/useMessagesStore";
import type { Address } from "viem";
import Composer from "../Composer";
import Consent from "./Consent";
import Messages from "./Message";

const MessagesList: FC = () => {
  const { selectedConversation } = useMessagesStore();
  const { messages } = useMessages(selectedConversation as CachedConversation);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const isStaff = useFlag(FeatureFlag.Staff);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedConversation) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between px-5 py-2.5">
        <LazyDefaultProfile
          address={selectedConversation.peerAddress as Address}
        />
        <Consent address={selectedConversation.peerAddress as Address} />
      </div>
      <div className="divider" />
      <div
        className={cn(
          isStaff ? "h-[79vh] max-h-[79vh]" : "h-[81.5vh] max-h-[81.5vh]",
          "flex flex-col-reverse space-y-5 overflow-y-auto p-5"
        )}
      >
        <div ref={endOfMessagesRef} />
        {[...messages].reverse().map((message) => (
          <Messages key={message.id} message={message} />
        ))}
      </div>
      <Composer conversation={selectedConversation} />
    </div>
  );
};

export default MessagesList;
