import Loader from '@components/Shared/Loader';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { EmptyState } from '@hey/ui';
import { useConversations } from '@xmtp/react-sdk';

const ChatsView = () => {
  const { conversations, isLoaded, isLoading } = useConversations();

  if (isLoading) {
    return (
      <div className="page-center flex-col">
        <Loader message="Loading conversations..." />
      </div>
    );
  }

  if (isLoaded && conversations.length === 0) {
    return (
      <EmptyState
        icon={<ChatBubbleLeftRightIcon className="text-brand-500 h-8 w-8" />}
        message="No conversations"
      />
    );
  }
};

export default ChatsView;
