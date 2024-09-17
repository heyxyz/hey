import type { FC } from "react";

import setFingerprint from "@helpers/setFingerprint";
import { useEffect } from "react";
import { useLeafwatchStore } from "src/store/persisted/useLeafwatchStore";
import { v4 as uuid } from "uuid";

const LeafwatchProvider: FC = () => {
  const { anonymousId, setAnonymousId } = useLeafwatchStore();

  useEffect(() => {
    setFingerprint();
  }, []);

  useEffect(() => {
    if (!anonymousId) {
      setAnonymousId(uuid());
    }
  }, [anonymousId, setAnonymousId]);

  return null;
};

export default LeafwatchProvider;
