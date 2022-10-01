import { Card, CardBody } from '@components/UI/Card';
import { BeakerIcon, CurrencyDollarIcon } from '@heroicons/react/outline';
import { FC } from 'react';
import { APP_NAME, IS_MAINNET } from 'src/constants';

const Announcement: FC = () => {
  return (
    <Card as="aside" className="mb-4 border-yellow-400 !bg-yellow-300 !bg-opacity-20">
      <CardBody className="space-y-2.5 text-yellow-600">
        <div className="flex items-center space-x-2 font-bold">
          <BeakerIcon className="w-5 h-5" />
          <p>Beta warning!</p>
        </div>
        <p className="text-sm leading-[22px]">
          {APP_NAME} is still in the beta phase, things may break, please handle us with care.
        </p>
        {!IS_MAINNET && (
          <div className="flex items-center space-x-1.5 text-sm font-bold">
            <CurrencyDollarIcon className="w-4 h-4" />
            <a href="https://faucet.polygon.technology/" target="_blank" rel="noreferrer noopener">
              Get testnet tokens
            </a>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default Announcement;
