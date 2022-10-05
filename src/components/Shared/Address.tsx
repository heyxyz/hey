import classNames from '@lib/classNames';
import formatAddress from '@lib/formatAddress';
import { useEnsName } from 'wagmi';

type AddressProps = {
  address: string;
  className?: string;
};

const Address = ({ address, className }: AddressProps): JSX.Element => {
  const { data: name, isLoading } = useEnsName({
    address
  });

  return (
    <span
      className={classNames(className || '', 'font-mono', isLoading ? 'animate-pulse' : '')}
      title={address}
    >
      {name || formatAddress(address)}
    </span>
  );
};

export default Address;
