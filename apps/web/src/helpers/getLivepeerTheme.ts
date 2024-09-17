import type { ThemeConfig } from "@livepeer/react";

import { BRAND_COLOR } from "@hey/data/constants";

import { heyFont } from "./fonts";

const getLivepeerTheme: ThemeConfig = {
  colors: {
    accent: "#fff",
    loading: BRAND_COLOR,
    progressLeft: BRAND_COLOR
  },
  fonts: {
    display: heyFont.style.fontFamily
  },
  fontSizes: {
    timeFontSize: "11px"
  },
  radii: {
    containerBorderRadius: "12px"
  },
  sizes: {
    iconButtonSize: "30px",
    thumb: "7px",
    thumbActive: "8px",
    trackActive: "3px",
    trackInactive: "3px"
  },
  space: {
    controlsBottomMarginX: "10px",
    controlsBottomMarginY: "5px",
    timeMarginX: "20px"
  }
};

export default getLivepeerTheme;
