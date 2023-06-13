import Loader from '@components/Shared/Loader';
import TipsOutlineIcon from '@components/Shared/TipIcons/TipsOutlineIcon';
import TipsSolidIcon from '@components/Shared/TipIcons/TipsSolidIcon';
import { t } from '@lingui/macro';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import type { Publication } from 'lens';
import humanize from 'lib/humanize';
import nFormatter from 'lib/nFormatter';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { Modal, Tooltip } from 'ui';
import { useAccount } from 'wagmi';

import { getPostQuadraticTipping } from './QuadraticQueries/grantsQueries';

const Tipping = dynamic(() => import('./Tipping'), {
  loading: () => <Loader message={t`Loading collect`} />
});
interface TipProps {
  publication: Publication;
  roundAddress: string;
}

const Tip: FC<TipProps> = ({ publication, roundAddress }) => {
  const { address } = useAccount();
  const [userTipCount, setUserTipCount] = useState(0);
  const [tipCount, setTipCount] = useState(0);
  const [tipTotal, setTipTotal] = useState(ethers.BigNumber.from(0));
  const [showTipModal, setShowTipModal] = useState(false);

  useEffect(() => {
    async function fetchPostQuadraticTipping() {
      try {
        const postQuadraticTipping = await getPostQuadraticTipping(publication?.id, roundAddress);

        let tipTotal = ethers.BigNumber.from(0);
        let tipCountFromUser = 0;
        if (postQuadraticTipping && postQuadraticTipping.votes) {
          for (const vote of postQuadraticTipping.votes) {
            if (vote.amount) {
              const weiAmount = ethers.BigNumber.from(vote.amount);
              tipTotal = tipTotal.add(weiAmount);
            }
            if (vote.from.toLowerCase() === address!.toLowerCase()) {
              tipCountFromUser++;
            }
          }
        }
        setUserTipCount(tipCountFromUser);
        setTipTotal(tipTotal);
        setTipCount(postQuadraticTipping?.votes?.length);
      } catch (error) {
        console.error('Error fetching post quadratic tipping:', error);
        return null;
      }
    }
    fetchPostQuadraticTipping();
  }, [roundAddress, address, publication?.id]);

  return (
    <>
      <div className="flex items-center space-x-1 text-red-500">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setShowTipModal(true);
          }}
          aria-label="Collect"
        >
          <div className="flex items-center">
            <div className="rounded-full p-1.5 hover:bg-red-300 hover:bg-opacity-20">
              <Tooltip
                placement="top"
                content={tipCount > 0 ? `${humanize(tipCount)} Total Tips by YOU!` : 'Quadratically Tip!'}
                withDelay
              >
                <div className="flex">
                  {userTipCount > 0 ? <TipsSolidIcon /> : <TipsOutlineIcon color="#EF4444" />}
                </div>
              </Tooltip>
            </div>
          </div>
        </motion.button>
        {tipCount > 0 && (
          <div>
            <span className="text-[11px] sm:text-xs">{nFormatter(userTipCount)}</span>
            <span className="mx-1 text-[11px] sm:text-xs">|</span>
            <span className="text-[11px] sm:text-xs">{nFormatter(tipCount)}</span>
          </div>
        )}
      </div>
      <Modal
        title={t`Tipping`}
        icon={
          <div className="text-brand">
            <TipsOutlineIcon color="#8B5CF6" />
          </div>
        }
        show={showTipModal}
        onClose={() => setShowTipModal(false)}
      >
        <Tipping
          address={address!}
          publication={publication}
          roundAddress={roundAddress}
          setShowTipModal={setShowTipModal}
          tipCount={tipCount}
          tipTotal={tipTotal}
        />
      </Modal>
    </>
  );
};

export default Tip;
