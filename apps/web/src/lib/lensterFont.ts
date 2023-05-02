import localFont from 'next/font/local';

const circluarStd = localFont({
  src: [
    {
      path: '../../public/fonts/CircularXXSub-Book.woff',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/CircularXXSub-Medium.woff',
      weight: '500',
      style: 'medium'
    },
    {
      path: '../../public/fonts/CircularXXSub-Bold.woff',
      weight: '700',
      style: 'bold'
    }
  ],
  fallback: ['sans-serif'],
  preload: true,
  display: 'swap'
});

export default circluarStd;
