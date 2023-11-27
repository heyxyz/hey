import { BRAND_COLOR } from '@hey/data/constants';
import type { ThemeConfig } from '@livepeer/react';

const getLivepeerTheme: ThemeConfig = {
  colors: {
    accent: '#fff',
    progressLeft: BRAND_COLOR,
    loading: BRAND_COLOR
  },
  fonts: {
    display: 'Sofia Pro'
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
