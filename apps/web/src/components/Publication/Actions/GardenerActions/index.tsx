import type {
  MirrorablePublication,
  ReportPublicationRequest
} from '@hey/lens';
import type { ApolloCache } from '@hey/lens/apollo';

import {
  BanknotesIcon,
  DocumentTextIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { GARDENER } from '@hey/data/tracking';
import {
  PublicationReportingSpamSubreason,
  useReportPublicationMutation
} from '@hey/lens';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Button, Modal } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useToggle } from '@uidotdev/usehooks';
import { useRouter } from 'next/router';
import { type FC, type ReactNode, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';

import Reports from './Reports';

interface GardenerActionsProps {
  publication: MirrorablePublication;
}

const GardenerActions: FC<GardenerActionsProps> = ({ publication }) => {
  const { pathname } = useRouter();
  const { setShowGardenerActionsAlert } = useGlobalAlertStateStore();
  const [hasReported, toggletHasReported] = useToggle(
    publication.operations?.hasReported
  );
  const [showModal, setShowModal] = useState(false);
  const [createReport, { loading }] = useReportPublicationMutation();

  const updateCache = (cache: ApolloCache<any>) => {
    if (pathname === '/mod') {
      cache.evict({ id: cache.identify(publication) });
    }
  };

  const reportPublication = async ({
    subreason,
    type
  }: {
    subreason: string;
    type: string;
  }) => {
    // Variables
    const request: ReportPublicationRequest = {
      for: publication.id,
      reason: {
        [type]: { reason: type.replace('Reason', '').toUpperCase(), subreason }
      }
    };

    return await createReport({
      onCompleted: () => setShowGardenerActionsAlert(false, null),
      update: updateCache,
      variables: { request }
    });
  };

  interface ReportButtonProps {
    config: { subreason: string; type: string }[];
    icon: ReactNode;
    label: string;
    type: string;
  }

  const ReportButton: FC<ReportButtonProps> = ({
    config,
    icon,
    label,
    type
  }) => (
    <Button
      disabled={loading || hasReported}
      icon={icon}
      onClick={() => {
        Leafwatch.track(GARDENER.REPORT, {
          publication_id: publication.id,
          type
        });

        toast.promise(
          Promise.all(
            config.map(async ({ subreason, type }) => {
              await reportPublication({ subreason, type });
            })
          ),
          {
            error: 'Error reporting publication',
            loading: 'Reporting publication...',
            success: () => {
              toggletHasReported();
              return 'Publication reported successfully';
            }
          }
        );
      }}
      outline
      size="sm"
      variant="warning"
    >
      {label}
    </Button>
  );

  return (
    <span
      className="flex flex-wrap items-center gap-3 text-sm"
      onClick={stopEventPropagation}
    >
      <ReportButton
        config={[
          {
            subreason: PublicationReportingSpamSubreason.LowSignal,
            type: 'spamReason'
          }
        ]}
        icon={<DocumentTextIcon className="size-4" />}
        label="Spam"
        type="spam"
      />
      <ReportButton
        config={[
          {
            subreason: PublicationReportingSpamSubreason.FakeEngagement,
            type: 'spamReason'
          }
        ]}
        icon={<BanknotesIcon className="size-4" />}
        label="Un-sponsor"
        type="un-sponsor"
      />
      <ReportButton
        config={[
          {
            subreason: PublicationReportingSpamSubreason.FakeEngagement,
            type: 'spamReason'
          },
          {
            subreason: PublicationReportingSpamSubreason.LowSignal,
            type: 'spamReason'
          }
        ]}
        icon={<BanknotesIcon className="size-4" />}
        label="Both"
        type="both"
      />
      <Button onClick={() => setShowModal(true)} outline size="sm">
        View Reports
      </Button>
      <Modal
        icon={<FlagIcon className="size-5 text-red-500" />}
        onClose={() => setShowModal(false)}
        show={showModal}
        size="lg"
        title="Reports"
      >
        <Reports publication={publication} />
      </Modal>
    </span>
  );
};

export default GardenerActions;
