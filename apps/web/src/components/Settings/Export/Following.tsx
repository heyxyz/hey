import downloadJson from "@hey/helpers/downloadJson";
import {
  type FollowingRequest,
  PageSize,
  useFollowingLazyQuery
} from "@hey/indexer";
import { Button, Card, CardHeader } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const Following: FC = () => {
  const { currentAccount } = useAccountStore();
  const [following, setFollowing] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const request: FollowingRequest = {
    pageSize: PageSize.Fifty,
    account: currentAccount?.address
  };

  const [exportFollowing] = useFollowingLazyQuery({
    fetchPolicy: "network-only"
  });

  const handleExportClick = async () => {
    setExporting(true);
    const fetchFollowing = async (cursor?: string) => {
      const { data } = await exportFollowing({
        onCompleted: (data) => {
          setFollowing((prev) => {
            const newFollowing = data.following.items.filter((newFollowing) => {
              return !prev.some(
                (following) =>
                  following.following.address === newFollowing.following.address
              );
            });

            return [...prev, ...newFollowing];
          });
        },
        variables: { request: { ...request, cursor } }
      });

      if (
        data?.following.items.length === 0 ||
        !data?.following.pageInfo.next
      ) {
        setFetchCompleted(true);
        setExporting(false);
      } else {
        await fetchFollowing(data?.following.pageInfo.next);
      }
    };

    await fetchFollowing();
  };

  const handleDownload = () => {
    downloadJson(following, "following", () => {
      setFollowing([]);
      setFetchCompleted(false);
    });
  };

  return (
    <Card>
      <CardHeader
        body="Export all your following to a JSON file."
        title="Export following"
      />
      <div className="m-5">
        {following.length > 0 ? (
          <div className="pb-2">
            Exported <b>{following.length}</b> following
          </div>
        ) : null}
        {fetchCompleted ? (
          <Button onClick={handleDownload} outline>
            Download following
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

export default Following;
