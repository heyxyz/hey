import type { ProfileTheme } from '@components/Profile';

import { audiowideFont, heyFont, noricanFont } from './fonts';

const getProfileThemeFont = (id: string) => {
  switch (id) {
    case 'norican':
      return noricanFont.className;
    case 'audiowide':
      return audiowideFont.className;
    default:
      return heyFont.className;
  }
};

const getProfileTheme = (
  theme: null | ProfileTheme
): {
  backgroundColour: string;
  bioFont: string;
  publicationFont: string;
} | null => {
  if (!theme) {
    return null;
  }

  const publicationFont = getProfileThemeFont(theme.publicationFont);

  return {
    backgroundColour: theme.backgroundColour,
    bioFont: theme.bioFont,
    publicationFont
  };
};

export default getProfileTheme;
