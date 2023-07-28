import { Menu } from '@headlessui/react';
import { FlagIcon } from '@heroicons/react/outline';
import { Modal, Radio } from '@lenster/ui';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import { type FC } from 'react';
import { useState } from 'react';

const Report: FC = () => {
  const [ReportProfile, setReportProfile] = useState(false);

  return (
    <>
      <Menu.Item
        as="div"
        className={() =>
          clsx('m-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm')
        }
        onClick={async () => {
          setReportProfile(true);
        }}
      >
        <div className="flex items-center space-x-2">
          <FlagIcon className="h-4 w-4" />
          <div>
            <Trans>Report Profile</Trans>
          </div>
        </div>
      </Menu.Item>
      <Modal
        title="Report Profile"
        icon={<FlagIcon className="text-brand h-5 w-5" />}
        show={ReportProfile}
        onClose={() => setReportProfile(false)}
      >
        <div className="p-5">
          <Radio
            title="Misleading Account"
            message="Impersonation or false claims about identity or affiliation"
            name="reportReason"
          />
          <Radio
            title="Frequently Posts Unwanted Content"
            message="Spam; excessive mentions or replies"
            name="reportReason"
          />
        </div>
      </Modal>
    </>
  );
};

export default Report;
