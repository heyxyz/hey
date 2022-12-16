import MetaTags from '@components/Common/MetaTags';
import Slug from '@components/Shared/Slug';
import UserProfile from '@components/Shared/UserProfile';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import type { Profile } from 'lens';
import Link from 'next/link';
import React from 'react';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';

const NFTDetail = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (!isFeatureEnabled('nft-gallery', currentProfile?.id)) {
    return <Custom404 />;
  }

  return (
    <GridLayout className="pt-6">
      <MetaTags title="NFT Details" />
      <GridItemEight className="space-y-5">
        <Card className="p-4">
          <img
            width={500}
            height={500}
            className="w-full h-full p-16"
            src="https://i.seadn.io/gae/qMfunIhyvoXGLufcKGh6GYF_iP0_5ngeo7M5PU6_MpwxMJignfm23JCemI6HVqMP0bcb6NUva5CtRQ30HE51J9TLg_68juYSe5T9Fg?auto=format&w=1000"
            alt=""
            draggable={false}
          />
        </Card>
      </GridItemEight>
      <GridItemFour className="space-y-4">
        <Card className="p-4">
          <h1>Subscape #363</h1>
          <Slug className="text-xs" slug="Subscapes" />
          <div className="text-xs pt-3">Sasi, Jouni, Yogi, and 10 others own Subscapes</div>
        </Card>
        <Card className="p-4">
          <h1 className="mb-2">Description</h1>
          <p className="text-sm opacity-60">
            A generative algorithm that draws the impression of a landscape from a multitude of possibilities.
            The unique seed from each token drives the parametric assortment of lines, colors, and forms into
            a constructed composition.
          </p>
        </Card>
        <Card className="p-4">
          <h1 className="mb-2">Owner</h1>
          <UserProfile profile={currentProfile as Profile} showUserPreview />
        </Card>
        <Card className="p-4 divide-y dark:divide-gray-700">
          <div className="pb-3">
            <div className="text-sm opacity-50">Floor price</div>
            <span>1.2 ETH</span>
          </div>
          <div className="py-3">
            <div className="text-sm opacity-50">Contract address</div>
            <div className="truncate">{currentProfile?.ownedBy}</div>
          </div>
          <div className="pt-3">
            <div className="text-sm opacity-50">Token ID</div>
            <div className="truncate">12</div>
          </div>
        </Card>
        <Card className="p-4">
          <h1 className="mb-2">View on</h1>
          <div className="flex flex-wrap gap-3">
            <Link
              href="rarible.com"
              className="px-3 py-0.5 border dark:border-gray-700 rounded-lg"
              target="_blank"
            >
              Lensport
            </Link>
            <Link
              href="opensea.io"
              className="px-3 py-0.5 border dark:border-gray-700 rounded-lg"
              target="_blank"
            >
              Opensea
            </Link>
            <Link
              href="rarible.com"
              className="px-3 py-0.5 border dark:border-gray-700 rounded-lg"
              target="_blank"
            >
              Rarible
            </Link>
            <Link
              href="opensea.io"
              className="px-3 py-0.5 border dark:border-gray-700 rounded-lg"
              target="_blank"
            >
              Uniswap
            </Link>
            <Link
              href="rarible.com"
              className="px-3 py-0.5 border dark:border-gray-700 rounded-lg"
              target="_blank"
            >
              Looksrare
            </Link>
            <Link
              href="rarible.com"
              className="px-3 py-0.5 border dark:border-gray-700 rounded-lg"
              target="_blank"
            >
              Etherscan
            </Link>
          </div>
        </Card>
      </GridItemFour>
    </GridLayout>
  );
};

export default NFTDetail;
