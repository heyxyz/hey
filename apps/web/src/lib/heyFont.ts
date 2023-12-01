import { join } from 'path';

export const heyFont = {
  src: [
    {
      path: join(
        process.cwd(),
        'public',
        'fonts',
        'SofiaProSoftReg-webfont.woff2'
      ),
      weight: '400',
      style: 'normal'
    },
    {
      path: join(
        process.cwd(),
        'public',
        'fonts',
        'SofiaProSoftMed-webfont.woff2'
      ),
      weight: '500',
      style: 'medium'
    },
    {
      path: join(
        process.cwd(),
        'public',
        'fonts',
        'SofiaProSoftBold-webfont.woff2'
      ),
      weight: '700',
      style: 'bold'
    }
  ],
  fallback: 'sans-serif',
  preload: true,
  display: 'swap'
};
