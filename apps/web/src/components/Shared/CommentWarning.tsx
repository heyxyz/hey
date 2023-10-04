import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Card } from '@hey/ui';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';

const CommentWarning: FC = () => {
  return (
    <Card className="flex items-center space-x-1.5 border-blue-300 !bg-blue-100 p-5 text-sm font-bold text-gray-500">
      <ChatBubbleLeftRightIcon className="h-4 w-4 text-blue-500" />
      <span>
        <Trans>You can't reply to this post</Trans>
      </span>
    </Card>
  );
};

export default CommentWarning;
