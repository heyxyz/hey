import type {
  MirrorablePublication,
  ReportPublicationRequest
} from '@hey/lens';

import P2PRecommendation from '@components/Shared/Profile/P2PRecommendation';
import { BanknotesIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import { GARDENER } from '@hey/data/tracking';
import {
  PublicationReportingSpamSubreason,
  useReportPublicationMutation
} from '@hey/lens';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Button } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC, type ReactNode, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';

interface GardenerActionsProps {
  publication: MirrorablePublication;
}

const GardenerActions: FC<GardenerActionsProps> = ({ publication }) => {
  const setShowGardenerActionsAlert = useGlobalAlertStateStore(
    (state) => state.setShowGardenerActionsAlert
  );

  const [hasReported, setHasReported] = useState(
    publication.operations.hasReported
  );
  const [spamCount, setSpamCount] = useState(0);
  const [unSponsorCount, setUnSponsorCount] = useState(0);
  const [bothCount, setBothCount] = useState(0);

  const [createReport, { loading }] = useReportPublicationMutation();

  const fetchGardenerReports = async () => {
    try {
      const response = await axios.get(`${HEY_API_URL}/gardener/reports`, {
        params: { id: publication.id }
      });
      const { data } = response;

      setSpamCount(data.result.spam);
      setUnSponsorCount(data.result.unSponsor);
      setBothCount(data.result.both);

      return true;
    } catch {
      return false;
    }
  };

  useQuery({
    queryFn: fetchGardenerReports,
    queryKey: ['fetchGardenerReports', publication.id]
  });

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
        [type]: {
          reason: type.replace('Reason', '').toUpperCase(),
          subreason
        }
      }
    };

    return await createReport({
      onCompleted: () => setShowGardenerActionsAlert(false, null),
      variables: { request }
    });
  };

  interface ReportButtonProps {
    config: {
      subreason: string;
      type: string;
    }[];
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
              setHasReported(true);

              if (type === 'spam') {
                setSpamCount(spamCount + 1);
              } else if (type === 'un-sponsor') {
                setUnSponsorCount(unSponsorCount + 1);
              } else if (type === 'both') {
                setBothCount(bothCount + 1);
              }

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
        label={`Spam ${spamCount > 0 ? `(${spamCount})` : ''}`}
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
        label={`Un-sponsor ${unSponsorCount > 0 ? `(${unSponsorCount})` : ''}`}
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
        label={`Both ${bothCount > 0 ? `(${bothCount})` : ''}`}
        type="both"
      />
      <P2PRecommendation
        profile={publication.by}
        recommendTitle="Recommend Profile"
        unrecommendTitle="Unrecommend Profile"
      />
    </span>
  );
};

export default GardenerActions;
