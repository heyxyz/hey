import type { IFeeds } from '@pushprotocol/restapi';

import { Button } from '@hey/ui';

interface FirstTimeConversationProps {
  approveUser: (item: IFeeds) => Promise<void>;
  rejectUser: (item: IFeeds) => Promise<void>;
  user: IFeeds | undefined;
}

const InitialConversation: React.FC<FirstTimeConversationProps> = ({
  approveUser,
  rejectUser,
  user
}) => {
  return (
    <div className="flex w-full rounded-e rounded-r-2xl rounded-bl-2xl border border-solid border-gray-300 p-2">
      <div className=" text-md flex w-full flex-col">
        <span>This is your first conversation with the sender.</span>
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          onClick={() => {
            approveUser(user!);
          }}
          variant="primary"
        >
          Approve
        </Button>
        <Button
          onClick={() => {
            rejectUser(user!);
          }}
          variant="secondary"
        >
          Deny
        </Button>
      </div>
    </div>
  );
};

export default InitialConversation;
