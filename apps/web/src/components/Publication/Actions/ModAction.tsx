import { Button } from '@components/UI/Button';
import type { LensterPublication } from '@generated/types';
import { ExclamationCircleIcon, ExternalLinkIcon, ShieldCheckIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';
import { MOD } from 'src/tracking';

interface Props {
  publication: LensterPublication;
}

const ModAction: FC<Props> = ({ publication }) => {
  const setShowReportModal = useGlobalModalStateStore((state) => state.setShowReportModal);

  return (
    <span className="flex items-center gap-3 mt-3 text-sm">
      <Button
        onClick={(event) => {
          event.stopPropagation();
          setShowReportModal(true, publication, { type: 'spamReason', subReason: 'FAKE_ENGAGEMENT' });
          Analytics.track(MOD.SPAM);
        }}
        variant="warning"
        icon={<ExclamationCircleIcon className="h-4 w-4" />}
        outline
      >
        Spam
      </Button>
      <Button
        onClick={(event) => {
          event.stopPropagation();
          setShowReportModal(true, publication);
          Analytics.track(MOD.OTHER);
        }}
        icon={<ShieldCheckIcon className="h-4 w-4" />}
      >
        Others
      </Button>
      <Button
        onClick={(event) => {
          event.stopPropagation();
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
