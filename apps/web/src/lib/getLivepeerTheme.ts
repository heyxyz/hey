import type { ThemeConfig } from '@livepeer/react';
import colors from 'tailwindcss/colors';

import circluarStd from './lensterFont';

const getLivepeerTheme: ThemeConfig = {
  colors: {
    accent: '#fff',
    progressLeft: colors.violet[500],
    loading: colors.violet[500]
  },
  fonts: {
    display: circluarStd.style.fontFamily
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
