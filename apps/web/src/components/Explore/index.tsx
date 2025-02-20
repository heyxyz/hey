import WhoToFollow from "@components/Home/Sidebar/WhoToFollow";
import FeedFocusType from "@components/Shared/FeedFocusType";
import Footer from "@components/Shared/Footer";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { MainContentFocus } from "@hey/indexer";
import { GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import cn from "@hey/ui/cn";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import ExploreFeed from "./ExploreFeed";
import ImageFeed from "./ImageFeed";

const Explore: NextPage = () => {
  const router = useRouter();
  const { currentAccount } = useAccountStore();
  const [focus, setFocus] = useState<MainContentFocus>();

  const tabs = [
    { name: "For you", type: "LensCurated" },
    { name: "Popular", type: "TopCommented" },
    {
      name: "Trending",
      type: "TopCollectedOpenAction"
    },
    { name: "Interesting", type: "TopMirrored" }
  ];

  return (
    <GridLayout>
      <GridItemEight className="space-y-5">
        <TabGroup
          defaultIndex={Number(router.query.tab)}
          onChange={(index) => {
            router.replace(
              { query: { ...router.query, tab: index } },
              undefined,
              { shallow: true }
            );
          }}
        >
          <TabList className="divider space-x-8">
            {tabs.map((tab, index) => (
              <Tab
                className={({ selected }) =>
                  cn(
                    { "border-black border-b-2 dark:border-white": selected },
                    "px-4 pb-2 font-medium text-xs outline-none sm:text-sm"
                  )
                }
                defaultChecked={index === 1}
                key={tab.type}
              >
                {tab.name}
              </Tab>
            ))}
          </TabList>
          <FeedFocusType focus={focus} setFocus={setFocus} />
          <TabPanels>
            {tabs.map((tab) => (
              <TabPanel key={tab.type}>
                {focus === MainContentFocus.Image ? (
                  <ImageFeed feedType={tab.type} />
                ) : (
                  <ExploreFeed feedType={tab.type} focus={focus} />
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </GridItemEight>
      <GridItemFour>
        {/* <Gitcoin /> */}
        {currentAccount ? <WhoToFollow /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Explore;
