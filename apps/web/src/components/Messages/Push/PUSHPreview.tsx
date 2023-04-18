import type { FC } from 'react';

interface PreviewListProps {
  selectedConversationKey?: string;
}
const PUSHPreview: FC<PreviewListProps> = () => {
  return (
    <div className="flex h-full flex-col justify-between">
      show push conversations to redirect to push conversation page
    </div>
  );
};

export default PUSHPreview;
