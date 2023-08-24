import { UserIcon } from '@heroicons/react/outline';

import Peers from './Peers/Peers';

export type TViewComponent = {
  [key: string]: {
    icon: JSX.Element;
    headerData: string;
    component: JSX.Element;
  };
};

const ViewComponent: TViewComponent = {
  peers: {
    icon: <UserIcon className="h-5 w-5" />,
    headerData: 'Peers',
    component: <Peers />
  }
};

export default ViewComponent;
