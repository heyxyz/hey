import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { Button } from '@components/UI/Button';
import { Card } from '@components/UI/Card';
import { CollectionIcon, UsersIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import { t, Trans } from '@lingui/macro';
import { CollectModules } from 'lens';
import type { Dispatch, FC } from 'react';
import toast from 'react-hot-toast';
import { useAccessSettingsStore } from 'src/store/access-settings';
import { useCollectModuleStore } from 'src/store/collect-module';
import { PUBLICATION } from 'src/tracking';

interface Props {
  setShowModal: Dispatch<boolean>;
}

const BasicSettings: FC<Props> = ({ setShowModal }) => {
  const restricted = useAccessSettingsStore((state) => state.restricted);
  const setRestricted = useAccessSettingsStore((state) => state.setRestricted);
  const followToView = useAccessSettingsStore((state) => state.followToView);
  const setFollowToView = useAccessSettingsStore((state) => state.setFollowToView);
  const collectToView = useAccessSettingsStore((state) => state.collectToView);
  const setCollectToView = useAccessSettingsStore((state) => state.setCollectToView);
  const hasConditions = useAccessSettingsStore((state) => state.hasConditions);
  const reset = useAccessSettingsStore((state) => state.reset);
  const selectedCollectModule = useCollectModuleStore((state) => state.selectedCollectModule);

  const onSave = () => {
    if (!hasConditions()) {
      reset();
    }
    setShowModal(false);
  };

  return (
    <div className="p-5">
      <ToggleWithHelper
        on={restricted}
        setOn={() => {
          if (!restricted) {
            reset();
          }
          setRestricted(!restricted);
          Analytics.track(PUBLICATION.NEW.ACCESS.TOGGLE_RESTRICTED_ACCESS);
        }}
        label={t`Add restrictions on who can view this post`}
      />
      {restricted && (
        <>
          <Card className="p-5 mt-5">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CollectionIcon className="h-4 w-4 text-brand-500" />
                <span>
                  <Trans>Collectors can view</Trans>
                </span>
              </div>
              <ToggleWithHelper
                on={collectToView}
                setOn={() => {
                  if (!collectToView && selectedCollectModule === CollectModules.RevertCollectModule) {
                    return toast.error(t`Enable collect first to use collect based token gating`);
                  }
                  setCollectToView(!collectToView);
                  Analytics.track(PUBLICATION.NEW.ACCESS.TOGGLE_COLLECT_TO_VIEW_ACCESS);
                }}
                label={t`People need to collect it first to be able to view it`}
              />
            </div>
          </Card>
          <Card className="p-5 mt-5">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <UsersIcon className="h-4 w-4 text-brand-500" />
                <span>
                  <Trans>Followers can view</Trans>
                </span>
              </div>
              <ToggleWithHelper
                on={followToView}
                setOn={() => {
                  setFollowToView(!followToView);
                  Analytics.track(PUBLICATION.NEW.ACCESS.TOGGLE_FOLLOW_TO_VIEW_ACCESS);
                }}
                label={t`People need to follow you to be able to view it`}
              />
            </div>
          </Card>
        </>
      )}
      <div className="pt-5 flex space-x-2">
        <Button className="ml-auto" variant="danger" outline onClick={onSave}>
          <Trans>Cancel</Trans>
        </Button>
        <Button onClick={onSave}>
          <Trans>Save</Trans>
        </Button>
      </div>
    </div>
  );
};

export default BasicSettings;
