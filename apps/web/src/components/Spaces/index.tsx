import type { FC } from 'react';
import React from 'react';
import { useSpacesStore } from 'src/store/spaces';

import PreviewSpaces from './PreviewSpaces/PreviewSpaces';
import SpacesWindow from './SpacesWindow/SpacesWindow';

const AudioSpaces: FC = () => {
  const { showSpacesLobby, showSpacesWindow } = useSpacesStore();
  return (
    <>
      {showSpacesLobby && <PreviewSpaces />}
      {showSpacesWindow && <SpacesWindow />}
    </>
  );
};

export default AudioSpaces;
