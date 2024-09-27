import getCurrentSession from "@helpers/getCurrentSession";
import getProfileDetails from "@hey/helpers/api/getProfileDetails";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { useProStore } from "src/store/non-persisted/useProStore";

const ProProvider: FC = () => {
  const { id: sessionProfileId } = getCurrentSession();
  const { setIsPro, setProExpiresAt, setLoading } = useProStore();

  useQuery({
    enabled: Boolean(sessionProfileId),
    queryFn: () => {
      setLoading(true);
      return getProfileDetails(sessionProfileId)
        .then((data) => {
          setIsPro(data?.pro?.isPro || false);
          setProExpiresAt(data?.pro?.expiresAt || null);
          return data;
        })
        .finally(() => setLoading(false));
    },
    queryKey: ["getProfileDetails", sessionProfileId || ""]
  });

  return null;
};

export default ProProvider;
