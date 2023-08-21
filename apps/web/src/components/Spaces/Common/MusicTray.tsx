import { useAppUtils } from '@huddle01/react/app-utils';
import { Radio } from '@lenster/ui';
import clsx from 'clsx';
import React, { useState } from 'react';
import { MusicTrack, useSpacesStore } from 'src/store/spaces';
import { useUpdateEffect } from 'usehooks-ts';

import { Icons } from '../Common/assets/Icons';

interface Props {
  onClose: () => void;
}

interface MusicTrackSelectionProps {
  value: MusicTrack;
  label: string;
}

const MusicTray: React.FC<Props> = ({ onClose }) => {
  const { sendData } = useAppUtils();
  const [musicTrack, setMusicTrack] = useState(MusicTrack.DEFAULT);
  const { setMyMusicTrack, isMyMusicPlaying, setIsMyMusicPlaying } =
    useSpacesStore();

  useUpdateEffect(() => {
    if (musicTrack !== MusicTrack.DEFAULT) {
      sendData('*', {
        musicTrack: musicTrack,
        isMusicPlaying: isMyMusicPlaying
      });
      setMyMusicTrack(musicTrack);
    }
  }, [isMyMusicPlaying]);

  const MusicTrackSelection = ({ value, label }: MusicTrackSelectionProps) => (
    <div className="border-b border-slate-700 p-2 text-center text-base font-semibold text-slate-100">
      <Radio
        value={value}
        heading={
          <div className="p-1 text-sm font-medium text-neutral-400">
            {label}
          </div>
        }
        onChange={() => setMusicTrack(value)}
        checked={musicTrack === value}
      />
    </div>
  );

  return (
    <div className="rounded-lg border border-slate-700 bg-neutral-900">
      <div className="relative">
        <div className="flex items-center justify-center gap-2 border-b border-slate-700 px-2 py-3 font-semibold text-slate-100">
          <div className="inline-flex h-8 w-8 flex-col"> {Icons.music} </div>
          <span className="text-sm font-medium text-slate-200">
            Background Music
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
        onClick={() => setIsMyMusicPlaying(!isMyMusicPlaying)}
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
          {isMyMusicPlaying ? 'Stop music' : 'Play music'}
        </div>
      </div>
    </div>
  );
};

export default MusicTray;
