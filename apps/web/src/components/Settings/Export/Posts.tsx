import { Leafwatch } from "@helpers/leafwatch";
import { SETTINGS } from "@hey/data/tracking";
import downloadJson from "@hey/helpers/downloadJson";
import type { PublicationsRequest } from "@hey/lens";
import { LimitType, usePublicationsLazyQuery } from "@hey/lens";
import { Button, Card, CardHeader } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const Posts: FC = () => {
  const { currentAccount } = useAccountStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const request: PublicationsRequest = {
    limit: LimitType.Fifty,
    where: { from: currentAccount?.id }
  };

  const [exportPublications] = usePublicationsLazyQuery({
    fetchPolicy: "network-only"
  });

  const handleExportClick = async () => {
    Leafwatch.track(SETTINGS.EXPORT.POSTS);
    setExporting(true);
    const fetchPosts = async (cursor?: string) => {
      const { data } = await exportPublications({
        onCompleted: (data) => {
          setPosts((prev) => {
            const newPosts = data.publications.items.filter((newPost) => {
              return !prev.some((post) => post.id === newPost.id);
            });

            return [...prev, ...newPosts];
          });
        },
        variables: { request: { ...request, cursor } }
      });

      if (
        data?.publications.items.length === 0 ||
        !data?.publications.pageInfo.next
      ) {
        setFetchCompleted(true);
        setExporting(false);
      } else {
        await fetchPosts(data?.publications.pageInfo.next);
      }
    };

    await fetchPosts();
  };

  const handleDownload = () => {
    downloadJson(posts, "posts", () => {
      setPosts([]);
      setFetchCompleted(false);
    });
  };

  return (
    <Card>
      <CardHeader
        body="Export all your posts, comments and mirrors to a JSON file."
        title="Export posts"
      />
      <div className="m-5">
        {posts.length > 0 ? (
          <div className="pb-2">
            Exported <b>{posts.length}</b> posts
          </div>
        ) : null}
        {fetchCompleted ? (
          <Button onClick={handleDownload} outline>
            Download posts
          </Button>
        ) : (
          <Button disabled={exporting} onClick={handleExportClick} outline>
            {exporting ? "Exporting..." : "Export now"}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Posts;
