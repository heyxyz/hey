import { useAppUtils } from '@huddle01/react/app-utils';
import { Radio } from '@lenster/ui';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { FC } from 'react';
import React from 'react';
import { MusicTrack, useSpacesStore } from 'src/store/spaces';
import { useUpdateEffect } from 'usehooks-ts';

import { Icons } from '../Common/assets/Icons';

interface MusicTrackSelectionProps {
  value: MusicTrack;
  label: string;
}

const MusicTray: FC = () => {
  const { sendData } = useAppUtils();
  const {
    setMyMusicTrack,
    isMyMusicPlaying,
    setIsMyMusicPlaying,
    myMusicTrack
  } = useSpacesStore();

  useUpdateEffect(() => {
    if (myMusicTrack !== MusicTrack.DEFAULT) {
      sendData('*', {
        musicTrack: myMusicTrack,
        isMusicPlaying: isMyMusicPlaying
      });
    }
  }, [isMyMusicPlaying]);

  const MusicTrackSelection = ({ value, label }: MusicTrackSelectionProps) => (
    <div className="border-b border-neutral-300 p-2 text-center text-base font-semibold dark:border-slate-700">
      <Radio
        value={value}
        heading={
          <div className="p-1 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            <Trans>{label}</Trans>
          </div>
        }
        onChange={() => setMyMusicTrack(value)}
        checked={myMusicTrack === value}
      />
    </div>
  );

  return (
    <div className="rounded-lg border border-neutral-300 dark:border-slate-700 dark:bg-neutral-900">
      <div className="relative">
        <div className="flex items-center justify-center border-b border-neutral-300 px-2 py-3 font-semibold text-slate-100 dark:border-slate-700">
          <div className="inline-flex h-8 w-8 flex-col"> {Icons.music} </div>
          <span className="text-sm font-medium text-neutral-700 dark:text-slate-200">
            <Trans>Background Music</Trans>
          </span>
        </div>
      </div>
      <MusicTrackSelection
        value={MusicTrack.CALM_MY_MIND}
        label="Calm My Mind"
      />
      <MusicTrackSelection
        value={MusicTrack.CRADLE_OF_SOUL}
        label="Cradle of Soul"
      />
      <MusicTrackSelection
        value={MusicTrack.FOREST_LULLABY}
        label="Forest Lullaby"
      />
      <div
        className={clsx(
          'bg-brand-500 inline-flex w-full cursor-pointer items-center gap-2 rounded-b-lg p-2',
          isMyMusicPlaying ? 'bg-red-400 bg-opacity-20' : 'bg-brand-500'
        )}
        onClick={() => {
          if (myMusicTrack !== MusicTrack.DEFAULT) {
            setIsMyMusicPlaying(!isMyMusicPlaying);
          }
        }}
      >
        <div
          className={clsx(
            'h-5 w-5',
            isMyMusicPlaying ? 'text-red-400' : 'text-slate-200'
          )}
        >
          {isMyMusicPlaying ? Icons.pauseMusic : Icons.playMusic}
        </div>
        <div
          className={clsx(
            'text-sm font-semibold',
            isMyMusicPlaying ? 'text-red-400' : 'text-slate-200'
          )}
        >
          <Trans>{isMyMusicPlaying ? 'Stop music' : 'Play music'}</Trans>
        </div>
      </div>
    </div>
  );
};

export default MusicTray;
