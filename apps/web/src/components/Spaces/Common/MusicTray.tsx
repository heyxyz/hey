import { MusicNoteIcon, PlayIcon, StopIcon } from '@heroicons/react/outline';
import { useAppUtils } from '@huddle01/react/app-utils';
import { Radio } from '@lenster/ui';
import cn from '@lenster/ui/cn';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import React from 'react';
import { MusicTrack } from 'src/enums';
import { useSpacesStore } from 'src/store/spaces';
import { useUpdateEffect } from 'usehooks-ts';

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
    console.log('Outside');
    if (myMusicTrack !== MusicTrack.DEFAULT) {
      console.log('Inside');
      sendData('*', {
        musicTrack: myMusicTrack,
        isMusicPlaying: isMyMusicPlaying
      });
    }
  }, [isMyMusicPlaying]);

  const MusicTrackSelection = ({ value, label }: MusicTrackSelectionProps) => (
    <div className="cursor-pointer border-b border-gray-300 p-2 text-center text-base font-semibold dark:border-gray-700">
      <Radio
        value={value}
        heading={
          <div className="p-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}
          </div>
        }
        onChange={() => setMyMusicTrack(value)}
        checked={myMusicTrack === value}
        name={myMusicTrack}
      />
    </div>
  );

  return (
    <div className="rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900">
      <div className="relative">
        <div className="flex items-center justify-center border-b border-gray-300 px-2 py-3 font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200">
          <MusicNoteIcon className="mr-2 h-5 w-5 " />
          <span className="text-sm font-medium">
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
        className={cn(
          'bg-brand-500 inline-flex w-full cursor-pointer items-center gap-2 rounded-b-lg px-1.5 py-2',
          isMyMusicPlaying ? 'bg-red-400 bg-opacity-20' : 'bg-brand-500'
        )}
        onClick={() => {
          if (myMusicTrack !== MusicTrack.DEFAULT) {
            setIsMyMusicPlaying(!isMyMusicPlaying);
          }
        }}
      >
        {isMyMusicPlaying ? (
          <StopIcon className="h-5 w-5 text-red-400" />
        ) : (
          <PlayIcon className="h-5 w-5 text-gray-200" />
        )}
        <div
          className={cn(
            'ml-1.5 text-sm font-semibold',
            isMyMusicPlaying ? 'text-red-400' : 'text-gray-200'
          )}
        >
          <Trans>{isMyMusicPlaying ? 'Stop music' : 'Play music'}</Trans>
        </div>
      </div>
    </div>
  );
};

export default MusicTray;
