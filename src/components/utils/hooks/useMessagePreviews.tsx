import { useQuery } from '@apollo/client';
import useXmtpClient from '@components/utils/hooks/useXmtpClient';
import type { Profile } from '@generated/types';
import { ProfilesDocument } from '@generated/types';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import type { Conversation, Message, Stream } from '@xmtp/xmtp-js';
import { SortDirection } from '@xmtp/xmtp-js';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

const useMessagePreviews = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { client } = useXmtpClient();
  const isMessagesEnabled = isFeatureEnabled('messages', currentProfile?.id);

  const [stream, setStream] = useState<Stream<Conversation>>();
  const conversations = useMessageStore((state) => state.conversations);
  const setConversations = useMessageStore((state) => state.setConversations);
  const messageProfiles = useMessageStore((state) => state.messageProfiles);
  const setMessageProfiles = useMessageStore((state) => state.setMessageProfiles);
  const previewMessages = useMessageStore((state) => state.previewMessages);
  const setPreviewMessages = useMessageStore((state) => state.setPreviewMessages);
  const [messagesLoading, setMessagesLoading] = useState<boolean>();

  const peerAddresses = Array.from(conversations.keys());
  const request = { ownedBy: peerAddresses, limit: 50 };
  const {
    loading: profilesLoading,
    error: profilesError,
    fetchMore
  } = useQuery(ProfilesDocument, {
    variables: {
      request: request
    },
    skip: !currentProfile?.id || peerAddresses.length === 0,
    onCompleted: async (data) => {
      if (!data?.profiles?.items?.length) {
        return;
      }
      const profiles = data.profiles.items as Profile[];
      const pageInfo = data.profiles.pageInfo;
      const newMessageProfiles = new Map(messageProfiles);
      for (const profile of profiles) {
        const peerAddress = (profile.ownedBy as string).toLowerCase();
        const previousProfile = newMessageProfiles.get(peerAddress);
        if (!previousProfile?.isDefault) {
          newMessageProfiles.set(peerAddress, profile);
        }
      }
      setMessageProfiles(newMessageProfiles);

      // Paginate through all profiles for the existing conversations.
      if (pageInfo.next) {
        await fetchMore({
          variables: { request: { ...request, cursor: pageInfo?.next } }
        });
      }
    }
  });

  useEffect(() => {
    if (!isMessagesEnabled || !client) {
      return;
    }

    const fetchMostRecentMessage = async (
      convo: Conversation
    ): Promise<{ address: string; message?: Message }> => {
      const peerAddress = convo.peerAddress.toLowerCase();
      const newMessages = await convo.messages({
        limit: 1,
        direction: SortDirection.SORT_DIRECTION_DESCENDING
      });
      if (newMessages.length <= 0) {
        return { address: peerAddress };
      }
      return { address: peerAddress, message: newMessages[0] };
    };

    const listConversations = async () => {
      setMessagesLoading(true);
      const newPreviewMessages = new Map(previewMessages);
      const newConversations = new Map(conversations);
      const convos = (await client?.conversations?.list()) || [];
      const previews = await Promise.all(
        convos.map(async (convo) => {
          newConversations.set(convo.peerAddress.toLowerCase(), convo);
          return await fetchMostRecentMessage(convo);
        })
      );
      for (const preview of previews) {
        if (preview.message) {
          newPreviewMessages.set(preview.address, preview.message);
        }
      }
      setPreviewMessages(newPreviewMessages);
      setConversations(newConversations);
      setMessagesLoading(false);
    };

    const closeStream = async () => {
      if (!stream) {
        return;
      }
      await stream.return();
    };
    const streamConversations = async () => {
      closeStream();
      const newStream = (await client?.conversations?.stream()) || [];
      setStream(newStream);
      for await (const convo of newStream) {
        const newPreviewMessages = new Map(previewMessages);
        const newConversations = new Map(conversations);
        newConversations.set(convo.peerAddress.toLowerCase(), convo);
        const preview = await fetchMostRecentMessage(convo);
        if (preview.message) {
          newPreviewMessages.set(preview.address, preview.message);
        }
        setPreviewMessages(newPreviewMessages);
        setConversations(newConversations);
      }
    };

    listConversations();
    streamConversations();

    return () => {
      closeStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  return {
    loading: messagesLoading || profilesLoading,
    messages: previewMessages,
    profiles: messageProfiles,
    profilesError: profilesError
  };
};

export default useMessagePreviews;
