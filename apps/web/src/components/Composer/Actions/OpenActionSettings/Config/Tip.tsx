import { type FC } from 'react';

interface TipConfigProps {
  name: string;
}

const TipConfig: FC<TipConfigProps> = ({ name }) => {
  return <div>{name}</div>;
};

export default TipConfig;
