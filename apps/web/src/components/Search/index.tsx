import Sidebar from "@components/Shared/Sidebar";
import { Leafwatch } from "@helpers/leafwatch";
import { PencilSquareIcon, UsersIcon } from "@heroicons/react/24/outline";
import { PAGEVIEW } from "@hey/data/tracking";
import { GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Custom404 from "src/pages/404";
import Accounts from "./Accounts";
import Posts from "./Posts";

const Search: NextPage = () => {
  const { query } = useRouter();
  const searchText = Array.isArray(query.q)
    ? encodeURIComponent(query.q.join(" "))
    : encodeURIComponent(query.q || "");

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: "search" });
  }, []);

  if (!query.q || !["profiles", "posts"].includes(query.type as string)) {
    return <Custom404 />;
  }

  const settingsSidebarItems = [
    {
      active: query.type === "posts",
      icon: <PencilSquareIcon className="size-4" />,
      title: "Publications",
      url: `/search?q=${searchText}&type=posts`
    },
    {
      active: query.type === "profiles",
      icon: <UsersIcon className="size-4" />,
      title: "Profiles",
      url: `/search?q=${searchText}&type=profiles`
    }
  ];

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar items={settingsSidebarItems} />
      </GridItemFour>
      <GridItemEight>
        {query.type === "profiles" ? (
          <Accounts query={query.q as string} />
        ) : null}
        {query.type === "posts" ? <Posts query={query.q as string} /> : null}
      </GridItemEight>
    </GridLayout>
  );
};

export default Search;
