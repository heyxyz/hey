import { Button } from '@components/UI/Button';
import { ExclamationCircleIcon, ExternalLinkIcon, ShieldCheckIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { stopEventPropagation } from '@lib/stopEventPropagation';
import { Trans } from '@lingui/macro';
import type { Publication } from 'lens';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';
import { MOD } from 'src/tracking';

interface Props {
  publication: Publication;
}

const ModAction: FC<Props> = ({ publication }) => {
  const setShowReportModal = useGlobalModalStateStore((state) => state.setShowReportModal);

  return (
    <span className="mt-3 flex items-center gap-3 text-sm" onClick={stopEventPropagation}>
      <Button
        onClick={() => {
          setShowReportModal(true, publication, { type: 'spamReason', subReason: 'FAKE_ENGAGEMENT' });
          Mixpanel.track(MOD.SPAM);
        }}
        variant="warning"
        icon={<ExclamationCircleIcon className="h-4 w-4" />}
        outline
      >
        <Trans>Spam</Trans>
      </Button>
      <Button
        onClick={() => {
          setShowReportModal(true, publication);
          Mixpanel.track(MOD.OTHER);
        }}
        icon={<ShieldCheckIcon className="h-4 w-4" />}
      >
        <Trans>Others</Trans>
      </Button>
      <Button
        onClick={() => {
          window.open(`/posts/${publication?.id}`, '_blank');
        }}
        icon={<ExternalLinkIcon className="h-4 w-4" />}
        className="py-[6px]"
        outline
      />
    </span>
  );
};

export default ModAction;
