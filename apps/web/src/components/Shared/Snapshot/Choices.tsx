import { CheckCircleIcon as CheckCircleIconOutline } from '@heroicons/react/outline';
import { CheckCircleIcon, MenuAlt2Icon } from '@heroicons/react/solid';
import { getTimetoNow } from '@lib/formatTime';
import { Mixpanel } from '@lib/mixpanel';
import { t, Trans } from '@lingui/macro';
import clsx from 'clsx';
import { Errors } from 'data';
import humanize from 'lib/humanize';
import nFormatter from 'lib/nFormatter';
import type { FC } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import type { Proposal, Vote } from 'snapshot';
import { useAppStore } from 'src/store/app';
import { PUBLICATION } from 'src/tracking';
import { Card, Modal } from 'ui';

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
  const [voteConfig, setVoteConfig] = useState({
    show: false,
    position: 0
  });

  const { choices, symbol, scores, scores_total, state, type, end } = proposal;
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
    Mixpanel.track(PUBLICATION.WIDGET.SNAPSHOT.OPEN_CAST_VOTE, {
      proposal_id: proposal.id
    });
  };

  return (
    <>
      <Card className={clsx(isLensterPoll ? 'mt-3' : 'mt-5')}>
        {!isLensterPoll && (
          <div className="divider flex items-center justify-between px-5 py-3 ">
            <div className="flex items-center space-x-2 text-sm">
              <MenuAlt2Icon className="h-4 w-4" />
              <b>
                {proposal.state === 'active' ? t`Current results` : t`Results`}
              </b>
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
                onClick={() => openVoteModal(position)}
              >
                <CheckCircleIcon
                  className={clsx(
                    voted ? 'text-green-500' : 'text-gray-500',
                    'h-6 w-6 '
                  )}
                />
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
                <Trans>{humanize(scores_total ?? 0)} Votes</Trans>
              </span>
              <span>·</span>
              <span>
                <Trans>{getTimetoNow(new Date(end * 1000))} left</Trans>
              </span>
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
