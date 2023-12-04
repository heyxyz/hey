import localFont from 'next/font/local';

const heyFont = localFont({
  display: 'swap',
  fallback: ['sans-serif'],
  preload: true,
  src: [
    {
      path: '../../public/fonts/SofiaProSoftReg-webfont.woff2',
      style: 'normal',
      weight: '400'
    },
    {
      path: '../../public/fonts/SofiaProSoftMed-webfont.woff2',
      style: 'medium',
      weight: '500'
    },
    {
      path: '../../public/fonts/SofiaProSoftBold-webfont.woff2',
      style: 'bold',
      weight: '700'
    }
  ]
});

export default heyFont;
