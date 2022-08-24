import { CardBody } from '@components/UI/Card';
import { ApprovedAllowanceAmount, Query } from '@generated/types';
import React, { FC } from 'react';

import Module from './Module';

interface Props {
  allowance: Query;
}

const Allowance: FC<Props> = ({ allowance }) => {
  return (
    <CardBody className="space-y-4">
      {allowance?.approvedModuleAllowanceAmount?.map((item: ApprovedAllowanceAmount) =>
        item?.module === 'RevertCollectModule' || item?.module === 'FreeCollectModule' ? (
          ''
        ) : (
          <Module key={item?.contractAddress} module={item} />
        )
      )}
    </CardBody>
  );
};

export default Allowance;
