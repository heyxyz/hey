import { type Profile } from '@generated/types';
import getAvatar from '@lib/getAvatar';
import clsx from 'clsx';
import React, { type DetailedHTMLProps, type FC, type ImgHTMLAttributes, type ReactElement } from 'react';

type ImgProps = DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
type Props = ImgProps & {
  profile?: Profile | null;
  isNft?: boolean;
  render?: (imgProps: ImgProps) => ReactElement;
};

const cleanClassNameFromRoundingsAndBorder = (className: string): string =>
  className
    .split(' ')
    .filter((name) => !!name && name !== 'border') // filter out border
    .filter((name) => !!name && !name.includes('rounded')) // filter out rounded-* and extra spaces
    .join(' ');

const HexagonSVGClip = () => {
  return (
    <div style={{ width: 0, height: 0 }}>
      <svg height="0" viewBox="0 0 200 188" width="0">
        <defs>
          <clipPath
            clipPathUnits="objectBoundingBox"
            id="hexagon-clip-config"
            transform="scale(0.005 0.005319148936170213)"
          >
            <path d="M193.248 69.51C185.95 54.1634 177.44 39.4234 167.798 25.43L164.688 20.96C160.859 15.4049 155.841 10.7724 149.998 7.3994C144.155 4.02636 137.633 1.99743 130.908 1.46004L125.448 1.02004C108.508 -0.340012 91.4873 -0.340012 74.5479 1.02004L69.0879 1.46004C62.3625 1.99743 55.8413 4.02636 49.9981 7.3994C44.155 10.7724 39.1367 15.4049 35.3079 20.96L32.1979 25.47C22.5561 39.4634 14.0458 54.2034 6.74789 69.55L4.39789 74.49C1.50233 80.5829 0 87.2441 0 93.99C0 100.736 1.50233 107.397 4.39789 113.49L6.74789 118.43C14.0458 133.777 22.5561 148.517 32.1979 162.51L35.3079 167.02C39.1367 172.575 44.155 177.208 49.9981 180.581C55.8413 183.954 62.3625 185.983 69.0879 186.52L74.5479 186.96C91.4873 188.32 108.508 188.32 125.448 186.96L130.908 186.52C137.638 185.976 144.163 183.938 150.006 180.554C155.85 177.17 160.865 172.526 164.688 166.96L167.798 162.45C177.44 148.457 185.95 133.717 193.248 118.37L195.598 113.43C198.493 107.337 199.996 100.676 199.996 93.93C199.996 87.1841 198.493 80.5229 195.598 74.43L193.248 69.51Z" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

const Avatar: FC<Props> = ({ profile, isNft, render, ...imgProps }) => {
  const { alt: altProp, src: srcProp, className: classNameProp, ...restImgProps } = imgProps;

  const alt = altProp ?? profile?.handle;
  const src = srcProp ?? getAvatar(profile);

  const isNftAvatar = isNft ?? profile?.picture?.__typename === 'NftImage';
  const className = clsx(
    isNftAvatar ? classNameProp && cleanClassNameFromRoundingsAndBorder(classNameProp) : classNameProp,
    isNftAvatar && 'hexagon'
  );

  return render ? (
    render({ alt, src, className, ...restImgProps })
  ) : (
    <div>
      <HexagonSVGClip />
      <div>
        <img src={src} alt={alt} className={className} {...restImgProps} style={{ maxWidth: 'none' }} />
      </div>
    </div>
  );
};

export default Avatar;
