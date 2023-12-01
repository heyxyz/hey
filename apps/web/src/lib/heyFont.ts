import { join } from 'path';

const getFontForSrc = (fontname: string, weight: string, style: string) => {
  return {
    path: join(process.cwd(), 'public', 'fonts', fontname),
    weight,
    style
  };
};

export const heyFont = [
  {
    src: [
      getFontForSrc('SofiaProSoftReg-webfont.woff2', '400', 'normal'),
      getFontForSrc('SofiaProSoftMed-webfont.woff2', '500', 'medium'),
      getFontForSrc('SofiaProSoftBold-webfont.woff2', '700', 'bold')
    ],
    fallback: 'sans-serif',
    preload: true,
    display: 'swap',
    selector: 'body'
  }
];
