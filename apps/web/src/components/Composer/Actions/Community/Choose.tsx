import type { Dispatch, FC } from 'react';

interface ChooseProps {
  setShowModal: Dispatch<boolean>;
}

const Choose: FC<ChooseProps> = ({ setShowModal }) => {
  return <div className="p-5">gm</div>;
};

export default Choose;
