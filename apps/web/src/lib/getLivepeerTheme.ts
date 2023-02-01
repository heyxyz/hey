import type { ThemeConfig } from '@livepeer/react';

const getLivepeerTheme: ThemeConfig = {
  colors: {
    accent: '#fff',
    progressLeft: '#8b5bf6',
    loading: '#8b5bf6'
  },
  fonts: {
    display: 'Matter'
  },
  fontSizes: {
    timeFontSize: '11px'
  },
  space: {
    timeMarginX: '20px',
    controlsBottomMarginX: '10px',
    controlsBottomMarginY: '5px'
  },
  sizes: {
    iconButtonSize: '30px',
    thumb: '7px',
    thumbActive: '8px',
    trackActive: '3px',
    trackInactive: '3px'
  },
  radii: {
    containerBorderRadius: '12px'
  }
};

export default getLivepeerTheme;
