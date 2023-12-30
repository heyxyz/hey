import { GridItemEight, GridLayout } from '@hey/ui';
import { useRouter } from 'next/router';

type Props = {};

const Messages = (props: Props) => {
  const {
    isReady,
    query: { handle, id, type }
  } = useRouter();

  return (
    <div>
      <GridLayout>
        <GridItemEight className="flex ">
          <div className=" w-1/4 border-r border-gray-300">
            <h2 className="text-xl font-medium capitalize">Messages</h2>
          </div>
          <div className="w-3/4">
            {/* Header */}
            <div className="text-xl font-medium capitalize">
              <span>UserName</span>
            </div>
          </div>
        </GridItemEight>
      </GridLayout>
    </div>
  );
};

export default Messages;
