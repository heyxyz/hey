import {
  Aboreto,
  Akaya_Kanadaka,
  Archivo,
  Archivo_Narrow,
  Arima,
  Audiowide,
  Azeret_Mono,
  BioRhyme,
  Norican
} from 'next/font/google';
import localFont from 'next/font/local';

export const heyFont = localFont({
  display: 'swap',
  fallback: ['sans-serif'],
  preload: true,
  src: [
    {
      path: '../../public/fonts/SofiaProSoftReg.woff2',
      style: 'normal',
      weight: '400'
    },
    {
      path: '../../public/fonts/SofiaProSoftMed.woff2',
      style: 'medium',
      weight: '600'
    },
    {
      path: '../../public/fonts/SofiaProSoftBold.woff2',
      style: 'bold',
      weight: '700'
    }
  ],
  style: 'normal'
});

export const noricanFont = Norican({ subsets: ['latin'], weight: '400' });
export const aboretoFont = Aboreto({ subsets: ['latin'], weight: '400' });
export const akayaKanadakaFont = Akaya_Kanadaka({
  subsets: ['latin'],
  weight: '400'
});
export const archivoFont = Archivo({ subsets: ['latin'], weight: '400' });
export const archivoNarrowFont = Archivo_Narrow({
  subsets: ['latin'],
  weight: '400'
});
export const arimaFont = Arima({ subsets: ['latin'], weight: '400' });
export const audiowideFont = Audiowide({ subsets: ['latin'], weight: '400' });
export const azeretMonoFont = Azeret_Mono({
  subsets: ['latin'],
  weight: '400'
});
export const bioRhymeFont = BioRhyme({ subsets: ['latin'], weight: '400' });
