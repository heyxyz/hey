import { Profile } from '@generated/types';
import getAvatar from '@lib/getAvatar';
import clsx from 'clsx';
import React, { DetailedHTMLProps, FC, ImgHTMLAttributes, ReactElement } from 'react';

type ImgProps = DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
type Props = ImgProps & {
  profile?: Profile;
  isNft?: boolean;
  // eslint-disable-next-line no-unused-vars
  render?: (imgProps: ImgProps) => ReactElement;
};

const cleanClassNameFromRoundings = (className: string): string =>
  className
    .split(' ')
    .filter((name) => !!name && !name.includes('rounded')) // filter out rounded-* and extra spaces
    .join(' ');

const Avatar: FC<Props> = ({ profile, isNft, render, ...imgProps }) => {
  const isNftAvatar = isNft ?? profile?.picture?.__typename === 'NftImage';
  const { alt: altProp, src: srcProp, className: classNameProp, ...restImgProps } = imgProps;
  const alt = altProp ?? profile?.handle;
  const src = srcProp ?? getAvatar(profile);
  const className = clsx(
    isNftAvatar ? classNameProp && cleanClassNameFromRoundings(classNameProp) : classNameProp,
    isNftAvatar && 'hexagon'
  );

  return render ? (
    render({ alt, src, className, ...restImgProps })
  ) : (
    <img src={src} alt={alt} className={className} {...restImgProps} />
  );
};

export default Avatar;
