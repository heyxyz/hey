import type { IFeeds, IMessageIPFSWithCID } from '@pushprotocol/restapi';

import { Button } from '@hey/ui';
import toast from 'react-hot-toast';
import usePushHooks from 'src/hooks/messaging/push/usePush';
import { usePushChatStore } from 'src/store/persisted/usePushChatStore';

interface FirstTimeConversationProps {
  message: IFeeds;
}

const InitialConversation: React.FC<FirstTimeConversationProps> = ({
  message
}) => {
  const { useApproveUser, useRejectUser } = usePushHooks();
  const { mutateAsync: approveUser } = useApproveUser();
  const { mutateAsync: rejectUser } = useRejectUser();
  const setRecipientChat = usePushChatStore((state) => state.setRecipientChat);
  const deleteRequestFeed = usePushChatStore(
    (state) => state.deleteRequestFeed
  );

  const onApprove = async () => {
    try {
      await approveUser();
      deleteRequestFeed(message.did);
      setRecipientChat([message.msg as IMessageIPFSWithCID]);
    } catch (error) {
      toast.error('Failed to approve user');
    }
  };

  const onReject = async () => {
    try {
      await rejectUser();
      deleteRequestFeed(message.did);
    } catch (error) {
      toast.error('Failed to reject user');
    }
  };

  return (
    <div className="flex w-full rounded-2xl border border-solid border-gray-300 p-2">
      <div className=" text-md flex w-full flex-col">
        <span>This is your first conversation with the sender.</span>
      </div>
      <div className="flex justify-end space-x-2">
        <Button onClick={onApprove} variant="primary">
          Approve
        </Button>
        <Button onClick={onReject} variant="secondary">
          Deny
        </Button>
      </div>
    </div>
  );
};

export default InitialConversation;
