import { useQuery } from '@apollo/client';
import useXmtpClient from '@components/utils/hooks/useXmtpClient';
import type { Profile } from '@generated/types';
import { ProfilesDocument } from '@generated/types';
import buildConversationId from '@lib/buildConversationId';
import { buildConversationKey, parseConversationKey } from '@lib/conversationKey';
import conversationMatchesProfile from '@lib/conversationMatchesProfile';
import type { Conversation, Stream } from '@xmtp/xmtp-js';
import { SortDirection } from '@xmtp/xmtp-js';
import type { DecodedMessage } from '@xmtp/xmtp-js/dist/types/src/Message';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

const useMessagePreviews = () => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const conversations = useMessageStore((state) => state.conversations);
  const setConversations = useMessageStore((state) => state.setConversations);
  const messageProfiles = useMessageStore((state) => state.messageProfiles);
  const setMessageProfiles = useMessageStore((state) => state.setMessageProfiles);
  const previewMessages = useMessageStore((state) => state.previewMessages);
  const setPreviewMessages = useMessageStore((state) => state.setPreviewMessages);
  const selectedProfileId = useMessageStore((state) => state.selectedProfileId);
  const setSelectedProfileId = useMessageStore((state) => state.setSelectedProfileId);
  const setPreviewMessage = useMessageStore((state) => state.setPreviewMessage);
  const reset = useMessageStore((state) => state.reset);
  const { client, loading: creatingXmtpClient } = useXmtpClient();
  const [peerAddresses, setPeerAddresses] = useState<Set<string>>(new Set<string>());
  const [messagesLoading, setMessagesLoading] = useState<boolean>(true);

  const getAddressFromKey = (key: string): string | null => {
    const parsed = parseConversationKey(key);
    const userAddress = currentProfile?.ownedBy;
    if (!parsed || !userAddress) {
      return null;
    }

    return parsed.members.find((member) => member !== userAddress) ?? null;
  };

  const request = { ownedBy: Array.from(peerAddresses.values()), limit: 50 };
  const {
    loading: profilesLoading,
    error: profilesError,
    fetchMore
  } = useQuery(ProfilesDocument, {
    variables: {
      request: request
    },
    skip: peerAddresses.size === 0 || currentProfile?.id !== selectedProfileId,
    onCompleted: async (data) => {
      if (!data?.profiles?.items.length) {
        return;
      }

      const profiles = data.profiles.items as Profile[];
      const newMessageProfiles = new Map(messageProfiles);
      for (const profile of profiles) {
        const peerAddress = profile.ownedBy as string;
        const key = buildConversationKey(peerAddress, buildConversationId(currentProfile?.id, profile.id));
        newMessageProfiles.set(key, profile);
      }
      setMessageProfiles(newMessageProfiles);

      // Paginate through all profiles for the existing conversations.
      const pageInfo = data.profiles.pageInfo;
      if (pageInfo.next) {
        await fetchMore({
          variables: { request: { ...request, cursor: pageInfo?.next } }
        });
      }
    }
  });

  useEffect(() => {
    if (!client || !currentProfile) {
      return;
    }
    const matcherRegex = conversationMatchesProfile(currentProfile.id);
    let messageStream: AsyncGenerator<DecodedMessage>;
    let conversationStream: Stream<Conversation>;

    const streamAllMessages = async () => {
      messageStream = await client.conversations.streamAllMessages();

      for await (const message of messageStream) {
        const conversationId = message.conversation.context?.conversationId;
        if (conversationId && matcherRegex.test(conversationId)) {
          const key = buildConversationKey(message.conversation.peerAddress, conversationId);
          setPreviewMessage(key, message);
        }
      }
    };

    const fetchMostRecentMessage = async (
      convo: Conversation
    ): Promise<{ key: string; message?: DecodedMessage }> => {
      const key = buildConversationKey(convo.peerAddress, convo.context?.conversationId as string);

      const newMessages = await convo.messages({
        limit: 1,
        direction: SortDirection.SORT_DIRECTION_DESCENDING
      });
      if (newMessages.length <= 0) {
        return { key };
      }
      return { key, message: newMessages[0] };
    };

    const listConversations = async () => {
      setMessagesLoading(true);
      const newPreviewMessages = new Map(previewMessages);
      const newConversations = new Map(conversations);
      const newPeerAddresses = new Set(peerAddresses);
      const convos = await client.conversations.list();
      const matchingConvos = convos.filter(
        (convo) => convo.context?.conversationId && matcherRegex.test(convo.context.conversationId)
      );

      for (const convo of matchingConvos) {
        const key = buildConversationKey(convo.peerAddress, convo.context?.conversationId as string);
        newConversations.set(key, convo);
      }

      const previews = await Promise.all(matchingConvos.map(fetchMostRecentMessage));

      for (const preview of previews) {
        const peerAddress = getAddressFromKey(preview.key);
        if (peerAddress) {
          newPeerAddresses.add(peerAddress);
        }
        if (preview.message) {
          newPreviewMessages.set(preview.key, preview.message);
        }
      }
      setPreviewMessages(newPreviewMessages);
      setConversations(newConversations);
      setMessagesLoading(false);
      if (newPeerAddresses.size > peerAddresses.size) {
        setPeerAddresses(newPeerAddresses);
      }
    };

    const closeConversationStream = async () => {
      if (!conversationStream) {
        return;
      }
      await conversationStream.return();
    };

    const closeMessageStream = async () => {
      if (messageStream) {
        await messageStream.return(undefined); // eslint-disable-line unicorn/no-useless-undefined
      }
    };

    const streamConversations = async () => {
      closeConversationStream();
      conversationStream = (await client?.conversations?.stream()) || [];
      const matcherRegex = conversationMatchesProfile(currentProfile?.id);
      for await (const convo of conversationStream) {
        // Ignore any new conversations not matching the current profile
        if (!convo.context?.conversationId || !matcherRegex.test(convo.context.conversationId)) {
          continue;
        }
        const newConversations = new Map(conversations);
        const newPeerAddresses = new Set(peerAddresses);
        const key = buildConversationKey(convo.peerAddress, convo.context.conversationId);
        newConversations.set(key, convo);
        if (convo.peerAddress && !peerAddresses.has(convo.peerAddress)) {
          newPeerAddresses.add(convo.peerAddress);
          setPeerAddresses(newPeerAddresses);
        }
        setConversations(newConversations);
      }
    };

    listConversations();
    streamConversations();
    streamAllMessages();

    return () => {
      closeConversationStream();
      closeMessageStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, currentProfile?.id, selectedProfileId]);

  useEffect(() => {
    if (selectedProfileId && currentProfile?.id !== selectedProfileId) {
      reset();
      setSelectedProfileId(currentProfile?.id);
      router.push('/messages');
    } else {
      setSelectedProfileId(currentProfile?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  return {
    authenticating: creatingXmtpClient,
    loading: messagesLoading || profilesLoading,
    messages: previewMessages,
    profiles: messageProfiles,
    profilesError: profilesError
  };
};

export default useMessagePreviews;
