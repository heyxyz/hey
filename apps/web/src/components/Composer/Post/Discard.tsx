import { Button, Card } from '@lenster/ui';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';

const Discard: FC = () => {
  const setShowNewPostModal = useGlobalModalStateStore(
    (state) => state.setShowNewPostModal
  );

  return (
    <Card className="space-y-3 p-5">
      <div>
        <Trans>{`This can’t be undone and you’ll lose your draft.`}</Trans>
      </div>
      <div className="flex items-center space-x-3">
        <Button outline>
          <Trans>Cancel</Trans>
        </Button>
        <Button onClick={() => setShowNewPostModal(false)} variant="danger">
          <Trans>Discard</Trans>
        </Button>
      </div>
    </Card>
  );
};

export default Discard;
