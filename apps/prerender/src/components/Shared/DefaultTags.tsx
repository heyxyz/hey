import { APP_NAME, DEFAULT_OG, DESCRIPTION } from 'data/constants';
import type { FC } from 'react';
import { BASE_URL } from 'src/constants';

import Tags from './Tags';

const DefaultTags: FC = () => {
  return (
    <>
      <Tags title={APP_NAME} description={DESCRIPTION} image={DEFAULT_OG} url={BASE_URL} />
      <div>{APP_NAME}</div>
    </>
  );
};

export default DefaultTags;
