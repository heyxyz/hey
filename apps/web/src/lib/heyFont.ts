import localFont from 'next/font/local';

const heyFont = localFont({
  src: [
    {
      path: '../../public/fonts/SofiaProSoftReg-webfont.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/SofiaProSoftMed-webfont.woff2',
      weight: '500',
      style: 'medium'
    },
    {
      path: '../../public/fonts/SofiaProSoftBold-webfont.woff2',
      weight: '700',
      style: 'bold'
    }
  ],
  fallback: ['sans-serif'],
  preload: true,
  display: 'swap'
});

export default heyFont;
