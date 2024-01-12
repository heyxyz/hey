import type { FC } from 'react';

import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Card } from '@hey/ui';

const CommentWarning: FC = () => {
  return (
    <Card className="flex items-center space-x-1.5 border-blue-300 !bg-blue-100 p-5 text-sm font-bold text-gray-500">
      <ChatBubbleLeftRightIcon className="size-4 text-blue-500" />
      <span>You can't reply to this post</span>
    </Card>
  );
};

export default CommentWarning;
