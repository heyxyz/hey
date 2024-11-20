import { Leafwatch } from "@helpers/leafwatch";
import { ACCOUNT } from "@hey/data/tracking";
import getAccount from "@hey/helpers/getAccount";
import type { Profile } from "@hey/lens";
import { Button, Modal } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import Slug from "../../Slug";
import FollowModule from "./FollowModule";

interface SuperFollowProps {
  buttonClassName: string;
  account: Profile;
  small: boolean;
  title: string;
}

const SuperFollow: FC<SuperFollowProps> = ({
  buttonClassName,
  account,
  small,
  title
}) => {
  const [showFollowModal, setShowFollowModal] = useState(false);
  const { currentAccount } = useAccountStore();
  const { setShowAuthModal } = useGlobalModalStateStore();

  return (
    <>
      <Button
        aria-label={title}
        className={buttonClassName}
        onClick={() => {
          if (!currentAccount) {
            setShowAuthModal(true);
            return;
          }
          setShowFollowModal(!showFollowModal);
          Leafwatch.track(ACCOUNT.OPEN_SUPER_FOLLOW);
        }}
        outline
        size={small ? "sm" : "md"}
      >
        {title}
      </Button>
      <Modal
        onClose={() => setShowFollowModal(false)}
        show={showFollowModal}
        title={
          <span>
            Super follow <Slug slug={getAccount(account).slugWithPrefix} />
          </span>
        }
      >
        <FollowModule
          account={account}
          setShowFollowModal={setShowFollowModal}
        />
      </Modal>
    </>
  );
};

export default SuperFollow;
