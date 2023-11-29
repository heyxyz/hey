import { Helmet } from 'react-helmet';
import Loading from '@components/Shared/Loading';
import { renderToString } from 'react-dom/server';
import MetaTags from '@components/Common/MetaTags';

export const renderBody = () => {
  return renderToString(<Loading />);
};

export const renderHead = () => {
  renderToString(<MetaTags />);
  return Helmet.renderStatic();
};
