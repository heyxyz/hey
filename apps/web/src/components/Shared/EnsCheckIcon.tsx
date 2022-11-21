import { STATIC_IMAGES_URL } from 'data/constants';
import * as React from 'react';

interface Props {
  alt?: string;
  className?: string;
}

const EnsCheckIcon: React.FC<Props> = ({ className, alt }) => {
  return <img src={`${STATIC_IMAGES_URL}/badges/ens.png`} className={className} alt={alt} />;
};

EnsCheckIcon.defaultProps = {
  alt: '',
  className: ''
};

export default EnsCheckIcon;
