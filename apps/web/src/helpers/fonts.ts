import { Norican, Rubik_Mono_One } from 'next/font/google';
import localFont from 'next/font/local';

export const heyFont = localFont({
  display: 'swap',
  fallback: ['sans-serif'],
  preload: true,
  src: [
    {
      path: '../../public/fonts/ProximaSoft-Medium.woff2',
      style: 'normal',
      weight: '500'
    },
    {
      path: '../../public/fonts/ProximaSoft-SemiBold.woff2',
      style: 'medium',
      weight: '600'
    },
    {
      path: '../../public/fonts/ProximaSoft-Bold.woff2',
      style: 'bold',
      weight: '700'
    }
  ],
  style: 'normal'
});

export const signatureFont = Norican({
  subsets: ['latin'],
  weight: '400'
});

export const rubikMonoOneFont = Rubik_Mono_One({
  subsets: ['latin'],
  weight: '400'
});
