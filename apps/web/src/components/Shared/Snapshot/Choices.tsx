import { CheckCircleIcon as CheckCircleIconOutline } from '@heroicons/react/outline';
import { CheckCircleIcon, MenuAlt2Icon } from '@heroicons/react/solid';
import {
  APP_NAME,
  Errors,
  IS_MAINNET,
  SNAPSHOR_RELAY_WORKER_URL
} from '@lenster/data';
import { getTimetoNow } from '@lib/formatTime';
import { Leafwatch } from '@lib/leafwatch';
import { Plural, t, Trans } from '@lingui/macro';
import type { Proposal, Vote } from '@workers/snapshot-relay';
import axios from 'axios';
import clsx from 'clsx';
import humanize from 'lib/humanize';
import nFormatter from 'lib/nFormatter';
import type { FC } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { PUBLICATION } from 'src/tracking';
import { Card, Modal, Spinner } from 'ui';

import New from '../Badges/New';
import VoteProposal from './VoteProposal';

interface ChoicesProps {
  proposal: Proposal;
  votes: Vote[];
  isLensterPoll?: boolean;
  refetch?: () => void;
}

const Choices: FC<ChoicesProps> = ({
  proposal,
  votes,
  isLensterPoll = false,
  refetch
}) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [voteSubmitting, setVoteSubmitting] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(0);
  const [voteConfig, setVoteConfig] = useState({
    show: false,
    position: 0
  });

  const { id, choices, symbol, scores, scores_total, state, type, end } =
    proposal;
  const vote = votes[0];
  const choicesWithVote = choices.map((choice, index) => ({
    position: index + 1,
    choice,
    score: scores?.[index] ?? 0,
    voted: Array.isArray(vote?.choice)
      ? vote?.choice.includes(index + 1)
      : vote?.choice === index + 1,
    percentage: ((scores?.[index] ?? 0) / (scores_total ?? 1)) * 100
  }));
  const sortedChoices = choicesWithVote.sort(
    (a, b) => b.percentage - a.percentage
  );

  const openVoteModal = (position: number) => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (state !== 'active') {
      return toast.error(t`This proposal is closed!`);
    }

    if (
      type === 'approval' ||
      type === 'quadratic' ||
      type === 'ranked-choice' ||
      type === 'weighted'
    ) {
      return toast.error(t`${type} voting is not supported yet!`);
    }

    setVoteConfig({ show: true, position });
    Leafwatch.track(PUBLICATION.WIDGET.SNAPSHOT.OPEN_CAST_VOTE, {
      proposal_id: id
    });
  };

  const voteLensterPoll = async (position: number) => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (state !== 'active') {
      return toast.error(t`This poll is ended!`);
    }

    try {
      setVoteSubmitting(true);
      await axios({
        url: `${SNAPSHOR_RELAY_WORKER_URL}/votePoll`,
        method: 'POST',
        data: {
          isMainnet: IS_MAINNET,
          accessToken: localStorage.getItem('accessToken'),
          choice: position,
          profileId: currentProfile.id,
          snapshotId: id
        }
      });
      refetch?.();
      Leafwatch.track(PUBLICATION.WIDGET.SNAPSHOT.VOTE, {
        proposal_id: id,
        proposal_source: APP_NAME.toLowerCase()
      });
      toast.success(t`Your vote has been casted!`);
    } catch (error) {
      console.error('Failed to vote on snapshot', error);
      toast.error(Errors.SomethingWentWrong);
    } finally {
      setVoteSubmitting(false);
    }
  };

  return (
    <>
      <Card className={clsx(isLensterPoll ? 'mt-3' : 'mt-5')}>
        {!isLensterPoll && (
          <div className="divider flex items-center justify-between px-5 py-3 ">
            <div className="flex items-center space-x-2 text-sm">
              <MenuAlt2Icon className="h-4 w-4" />
              <b>{state === 'active' ? t`Current results` : t`Results`}</b>
            </div>
            <New />
          </div>
        )}
        <div className="space-y-1 p-3">
          {sortedChoices.map(
            ({ position, choice, voted, percentage, score }) => (
              <button
                key={choice}
                className="flex w-full items-center space-x-2.5 rounded-xl p-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-900 sm:text-sm"
                disabled={isLensterPoll ? voteSubmitting : false}
                onClick={() => {
                  if (isLensterPoll) {
                    setSelectedPosition(position);
                    return voteLensterPoll(position);
                  }

                  return openVoteModal(position);
                }}
              >
                {isLensterPoll &&
                voteSubmitting &&
                position === selectedPosition ? (
                  <Spinner className="mr-1" size="sm" />
                ) : (
                  <CheckCircleIcon
                    className={clsx(
                      voted ? 'text-green-500' : 'text-gray-500',
                      'h-6 w-6 '
                    )}
                  />
                )}
                <div className="w-full space-y-1">
                  <div className="flex items-center justify-between">
                    <b>{choice}</b>
                    <div>
                      <span>
                        {nFormatter(score)} {isLensterPoll ? null : symbol}
                      </span>
                      <span className="mx-1.5">·</span>
                      <span className="lt-text-gray-500">
                        {Number.isNaN(percentage) ? 0 : percentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex h-2.5 overflow-hidden rounded-full bg-gray-300">
                    <div
                      style={{ width: `${percentage.toFixed(2)}%` }}
                      className={clsx(voted ? 'bg-green-500' : 'bg-brand-500')}
                    />
                  </div>
                </div>
              </button>
            )
          )}
        </div>
        {isLensterPoll && (
          <div className="flex items-center justify-between border-t px-5 py-3 dark:border-gray-700 ">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <MenuAlt2Icon className="h-4 w-4" />
              <b>
                <Trans>Poll</Trans>
              </b>
              <span>·</span>
              <span>
                {humanize(scores_total ?? 0)}{' '}
                <Plural
                  value={scores_total ?? 0}
                  zero="Vote"
                  one="Vote"
                  other="Votes"
                />
              </span>
              {state === 'active' && (
                <>
                  <span>·</span>
                  <span>
                    <Trans>{getTimetoNow(new Date(end * 1000))} left</Trans>
                  </span>
                </>
              )}
            </div>
            <New />
          </div>
        )}
      </Card>
      <Modal
        show={voteConfig.show}
        title={t`Cast your vote`}
        icon={<CheckCircleIconOutline className="text-brand h-5 w-5" />}
        onClose={() => setVoteConfig({ show: false, position: 0 })}
      >
        <VoteProposal
          proposal={proposal}
          voteConfig={voteConfig}
          setVoteConfig={setVoteConfig}
          refetch={refetch}
        />
      </Modal>
    </>
  );
};

export default Choices;
