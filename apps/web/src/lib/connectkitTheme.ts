import colors from 'tailwindcss/colors';

import heyFont from './heyFont';

const connectkitTheme = {
  '--ck-border-radius': '12px',
  '--ck-font-family': heyFont.style.fontFamily,
  '--ck-modal-heading-font-weight': 500,
  '--ck-overlay-background': 'rgb(113 113 122 / 0.75)',
  '--ck-primary-button-border-radius': '12px',
  '--ck-primary-button-box-shadow': `inset 0px 0px 0px 1px ${colors.zinc[200]}`,
  '--ck-primary-button-hover-box-shadow': `inset 0px 0px 0px 1px ${colors.zinc[300]}`,
  '--ck-qr-border-radius': '12px',
  '--ck-recent-badge-border-radius': '6px',
  '--ck-secondary-button-border-radius': '12px'
};

export default connectkitTheme;
