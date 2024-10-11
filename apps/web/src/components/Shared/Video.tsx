import { LockClosedIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon
} from "@heroicons/react/24/solid";
import { Spinner } from "@hey/ui";
import type { Src } from "@livepeer/react";
import * as Player from "@livepeer/react/player";
import type { FC } from "react";

const PlayerLoading = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center">
    <Spinner size="md" />
  </div>
);

interface VideoProps {
  src: Src[] | null;
  poster?: string;
}

const Video: FC<VideoProps> = ({ src, poster }) => {
  if (!src) {
    return null;
  }

  return (
    <Player.Root src={src}>
      <Player.Container className="size-full overflow-hidden rounded-xl bg-black">
        <Player.Video poster={poster} className="size-full" />
        <Player.LoadingIndicator>
          <PlayerLoading />
        </Player.LoadingIndicator>
        <Player.ErrorIndicator
          matcher="offline"
          className="absolute inset-0 flex flex-col items-center justify-center bg-black"
        >
          <div className="flex flex-col items-center space-y-2 text-lg text-white">
            <NoSymbolIcon className="size-8" />
            <b>Stream is offline</b>
          </div>
        </Player.ErrorIndicator>
        <Player.ErrorIndicator
          matcher="access-control"
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <div className="flex flex-col items-center space-y-2 text-lg text-white">
            <LockClosedIcon className="size-8" />
            <b>Stream is private</b>
          </div>
        </Player.ErrorIndicator>
        <Player.Controls className="flex flex-col-reverse gap-1 bg-gradient-to-b from-black/5 via-80% via-black/30 to-black/60 px-3 py-2 duration-1000 md:px-3">
          <div className="flex justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <Player.PlayPauseTrigger className="size-6 flex-shrink-0 transition hover:scale-110">
                <Player.PlayingIndicator asChild matcher={false}>
                  <PlayIcon className="size-5 text-white" />
                </Player.PlayingIndicator>
                <Player.PlayingIndicator asChild>
                  <PauseIcon className="size-5 text-white" />
                </Player.PlayingIndicator>
              </Player.PlayPauseTrigger>
              <Player.LiveIndicator className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-red-500" />
                <b className="text-white text-xs">LIVE</b>
              </Player.LiveIndicator>
              <Player.LiveIndicator matcher={false} className="flex">
                <Player.Time className="text-white text-xs" />
              </Player.LiveIndicator>
              <Player.MuteTrigger className="size-6 flex-shrink-0 transition hover:scale-110">
                <Player.VolumeIndicator asChild matcher={false}>
                  <SpeakerXMarkIcon className="size-5 text-white" />
                </Player.VolumeIndicator>
                <Player.VolumeIndicator asChild matcher={true}>
                  <SpeakerWaveIcon className="size-5 text-white" />
                </Player.VolumeIndicator>
              </Player.MuteTrigger>
              <Player.Volume className="relative flex max-w-28 flex-1 cursor-pointer items-center">
                <Player.Track className="relative h-1 grow rounded-full bg-white/30">
                  <Player.Range className="absolute h-full rounded-full bg-white" />
                </Player.Track>
                <Player.Thumb className="block size-2.5 rounded-full bg-white outline-none" />
              </Player.Volume>
            </div>
            <div className="flex items-center justify-end gap-2.5 sm:flex-1 md:flex-[1.5]">
              <Player.FullscreenTrigger className="size-6 flex-shrink-0 transition hover:scale-110">
                <Player.FullscreenIndicator asChild>
                  <ArrowsPointingInIcon className="size-5 text-white" />
                </Player.FullscreenIndicator>
                <Player.FullscreenIndicator matcher={false} asChild>
                  <ArrowsPointingOutIcon className="size-5 text-white" />
                </Player.FullscreenIndicator>
              </Player.FullscreenTrigger>
            </div>
          </div>
          <Player.Seek className="relative flex h-4 w-full cursor-pointer items-center">
            <Player.Track className="relative h-1 grow rounded-full bg-white/30">
              <Player.SeekBuffer className="absolute h-full rounded-full bg-white/60" />
              <Player.Range className="absolute h-full rounded-full bg-white" />
            </Player.Track>
            <Player.Thumb className="block size-2.5 rounded-full bg-white outline-none" />
          </Player.Seek>
        </Player.Controls>
      </Player.Container>
    </Player.Root>
  );
};

export default Video;
