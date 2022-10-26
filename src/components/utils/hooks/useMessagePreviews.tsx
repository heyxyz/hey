import { useQuery } from '@apollo/client';
import useXmtpClient from '@components/utils/hooks/useXmtpClient';
import type { Profile } from '@generated/types';
import { ProfilesDocument } from '@generated/types';
import buildConversationId from '@lib/buildConversationId';
import { buildConversationKey, parseConversationKey } from '@lib/conversationKey';
import conversationMatchesProfile from '@lib/conversationMatchesProfile';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import type { Conversation, Stream } from '@xmtp/xmtp-js';
import { SortDirection } from '@xmtp/xmtp-js';
import type { DecodedMessage } from '@xmtp/xmtp-js/dist/types/src/Message';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

const useMessagePreviews = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { client, loading: creatingXmtpClient } = useXmtpClient();
  const isMessagesEnabled = isFeatureEnabled('messages', currentProfile?.id);

  const conversations = useMessageStore((state) => state.conversations);
  const setConversations = useMessageStore((state) => state.setConversations);
  const messageProfiles = useMessageStore((state) => state.messageProfiles);
  const setMessageProfiles = useMessageStore((state) => state.setMessageProfiles);
  const previewMessages = useMessageStore((state) => state.previewMessages);
  const setPreviewMessages = useMessageStore((state) => state.setPreviewMessages);
  const setPreviewMessage = useMessageStore((state) => state.setPreviewMessage);
  const [profileIds, setProfileIds] = useState<Set<string>>(new Set<string>());
  const [conversationStream, setConversationStream] = useState<Stream<Conversation>>();
  // TODO: Remove this and replace with streamAllMessages. Just need to make some changes in xmtp-js first
  const [messageStreams, setMessageStreams] = useState<Map<string, Stream<DecodedMessage>>>(new Map());
  const [messagesLoading, setMessagesLoading] = useState<boolean>();

  const getProfileFromKey = (key: string): string | null => {
    const parsed = parseConversationKey(key);
    const userProfileId = currentProfile?.id;
    if (!parsed || !userProfileId) {
      return null;
    }

    return parsed.members.find((member) => member !== userProfileId) ?? null;
  };

  const request = { profileIds: Array.from(profileIds.values()) };
  const { loading: profilesLoading, error: profilesError } = useQuery(ProfilesDocument, {
    variables: {
      request: request
    },
    skip: !currentProfile?.id || profileIds.size === 0,
    onCompleted: (data) => {
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

      // TODO: Add pagination of results once Lens fixes an issue with their API where pagination and cursor
      // are not respected when querying by profileIds.
    }
  });

  const reset = () => {
    setConversations(new Map());
    setMessageProfiles(new Map());
    setPreviewMessages(new Map());
    setMessagesLoading(false);
  };

  useEffect(() => {
    if (!isMessagesEnabled || !client || !currentProfile) {
      return;
    }

    // TODO: Remove me and replace with streamAllMessages
    const streamMessages = async (conversationKey: string, conversation: Conversation) => {
      if (!conversation.context || messageStreams.has(conversationKey)) {
        return;
      }
      const stream = await conversation.streamMessages();
      messageStreams.set(conversationKey, stream);
      setMessageStreams(new Map(messageStreams));
      for await (const message of stream) {
        setPreviewMessage(conversationKey, message);
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
      const newProfileIds = new Set(profileIds);
      const convos = await client.conversations.list();
      const matcherRegex = conversationMatchesProfile(currentProfile.id);
      const matchingConvos = convos.filter(
        (convo) => convo.context?.conversationId && matcherRegex.test(convo.context.conversationId)
      );

      for (const convo of matchingConvos) {
        const key = buildConversationKey(convo.peerAddress, convo.context?.conversationId as string);
        newConversations.set(key, convo);
        streamMessages(key, convo);
      }

      const previews = await Promise.all(matchingConvos.map(fetchMostRecentMessage));

      for (const preview of previews) {
        const profileId = getProfileFromKey(preview.key);
        if (profileId) {
          newProfileIds.add(profileId);
        }
        if (preview.message) {
          newPreviewMessages.set(preview.key, preview.message);
        }
      }
      setPreviewMessages(newPreviewMessages);
      setConversations(newConversations);
      setMessagesLoading(false);
      if (newProfileIds.size > profileIds.size) {
        setProfileIds(newProfileIds);
      }
    };

    const closeConversationStream = async () => {
      if (!conversationStream) {
        return;
      }
      await conversationStream.return();
    };

    const closeMessageStreams = async () => {
      await Promise.allSettled(Array.from(messageStreams.values()).map((stream) => stream.return()));
      setMessageStreams(new Map());
    };

    const streamConversations = async () => {
      closeConversationStream();
      const newStream = (await client?.conversations?.stream()) || [];
      setConversationStream(newStream);
      const matcherRegex = conversationMatchesProfile(currentProfile?.id);
      for await (const convo of newStream) {
        // Ignore any new conversations not matching the current profile
        if (!convo.context?.conversationId || !matcherRegex.test(convo.context.conversationId)) {
          continue;
        }
        const newConversations = new Map(conversations);
        const newProfileIds = new Set(profileIds);
        const key = buildConversationKey(convo.peerAddress, convo.context.conversationId);
        newConversations.set(key, convo);
        const profileId = getProfileFromKey(key);
        if (profileId && !profileIds.has(profileId)) {
          newProfileIds.add(profileId);
          setProfileIds(newProfileIds);
        }
        setConversations(newConversations);
        streamMessages(key, convo);
      }
    };

    listConversations();
    streamConversations();

    return () => {
      closeConversationStream();
      closeMessageStreams();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, currentProfile?.id]);

  useEffect(() => {
    if (!currentProfile) {
      reset();
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
