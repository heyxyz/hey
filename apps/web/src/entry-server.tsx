import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';

import MetaTags from '@/components/Common/MetaTags';
import Loading from '@/components/Shared/Loading';

export const renderBody = () => {
  return renderToString(<Loading />);
};

export const renderHead = () => {
  renderToString(<MetaTags />);
  return Helmet.renderStatic();
};
