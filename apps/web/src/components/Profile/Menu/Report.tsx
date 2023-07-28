import { Menu } from '@headlessui/react';
import { FlagIcon } from '@heroicons/react/outline';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import { Modal } from '@lenster/ui';
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
        className={({ active }) =>
          clsx(
            { 'dropdown-active': active },
            'm-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm'
          )
        }
        onClick={async (event) => {
          stopEventPropagation(event);
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
        show={ReportProfile}
        onClose={() => setReportProfile(false)}
      >
        <div className="p-5">
          <p>Hi</p>
        </div>
      </Modal>
    </>
  );
};

export default Report;
