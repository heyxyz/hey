// import type { Publication } from 'lens';
// import type { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import TipsSolidIcon from '@components/Publication/Actions/Tips/TipIcons/TipsSolidIcon';
import { Card } from '@components/UI/Card';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useState } from 'react';

// interface Props {
//   icon: ReactNode;
//   publication: Publication;
//   showCount: boolean;
// }

interface ChildrenProps {
  // icon: ReactNode;
  // publication: Publication;
  // showCount: boolean;
  showDetails: boolean;
  setShowDetails: Dispatch<SetStateAction<boolean>>;
  roundOpen: boolean;
}
const RoundStats: FC<ChildrenProps> = ({ showDetails }) => {
  // const RoundStats: FC<ChildrenProps> = ({ icon, publication, showCount, showDetails, roundOpen }) => {
  const topic = 'justify-between flex';
  const category = 'text-gray-500';
  return (
    <div
      className={`pt-3 ${
        showDetails ? 'block h-auto transition-all duration-500 ease-in-out' : 'hidden overflow-hidden'
      }`}
    >
      <div>
        <div className="md:max-lg:px-50">
          <div className={topic}>
            <p className={category}>Tips Received</p>
            <p>22.376</p>
          </div>
          <div className={topic}>
            <p className={category}>Value in Dai</p>
            <p>22.30</p>
          </div>
          <div className={topic}>
            <p className={category}>Amount of Voters</p>
            <p>31</p>
          </div>
          <div className={topic}>
            <p className={category}>Posts in Current Round</p>
            <p>6</p>
          </div>
          <div className={`pt-3 ${topic}`}>
            <p className={category}>End of matching round</p>
            <p>5th nov 2023</p>
          </div>
          <div className={topic}>
            <p className={category}>Current Match in Dai</p>
            <p>980.55</p>
          </div>
        </div>
        <div className="text-gray-500 text-xs mt-8 mb-2">Tips per post:</div>
        <Card>
          <div className="m-4 text-md">
            <div className="my-2">
              <p>Coming to Eth Denver for the first time!</p>
              <p className="text-green-500 text-sm">67 tips by 10 voters</p>
            </div>
            <div className="w-full divider" />
            <div className="my-2">
              <p>Some other post</p>
              <p className="text-green-500 text-sm">4 tips by 1 voters</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// const ClaimReward: FC<ChildrenProps> = ({ icon, publication, showCount, showDetails, setShowDetails }) => {
const ClaimReward: FC<ChildrenProps> = ({ showDetails, setShowDetails }) => {
  return (
    <div className="flex flex-col alight-items-center">
      <button className="text-green-400  bg-green-100 rounded-full py-2 px-4 w-60 mx-auto">
        Claim Reward
      </button>
      <button onClick={() => setShowDetails(!showDetails)}>
        <p className="underline text-xs text-gray-500 mt-4">{showDetails ? 'hide' : 'show'} details</p>
      </button>
      <div>
        <RoundStats showDetails={showDetails} setShowDetails={setShowDetails} roundOpen={false} />
      </div>
    </div>
  );
};

export const ProfileTipsStats: FC = () => {
  // export const ProfileTipsStats: FC<Props> = ({ icon, publication, showCount }) => {
  // alert
  const roundOpen = true;
  // const iconClassName = true ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div>
      <div className="justify-center px-10 py-3 flex">
        <div className="mr-3 mt-1">
          <TipsSolidIcon size={20} />
        </div>
        <div>
          <div className="flex flex-col justify-between">
            <p className="mb-1">You've received 22376 tips so far!</p>
            <p>This will be matched with 980.55 DAI.</p>
          </div>
          {roundOpen ? (
            <div className="flex justify-between pt-3 item-center my-auto text-gray-500 text-xs">
              <div>
                <p>Round ends in # days</p>
              </div>
              <div className="mr-4">
                <button onClick={() => setShowDetails(!showDetails)}>
                  <p className="underline">{showDetails ? 'hide' : 'show'} details</p>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {roundOpen ? (
        <RoundStats showDetails={showDetails} setShowDetails={setShowDetails} roundOpen={roundOpen} />
      ) : (
        <ClaimReward showDetails={showDetails} setShowDetails={setShowDetails} roundOpen={roundOpen} />
      )}
    </div>
  );
};
