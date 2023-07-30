import { Button, Radio, TextArea } from '@lenster/ui';
import { t } from '@lingui/macro';
import { type FC, useState } from 'react';
import { useAppStore } from 'src/store/app';

const Report: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [isRadioSelected, setIsRadioSelected] = useState(false);

  return (
    <div className="flex flex-col space-y-2 p-3">
      <div className="space-y-2">
        <Radio
          title={t`Misleading Account`}
          value={t`Impersonation or false claims about identity or affiliation`}
          name="reportReason"
          onChange={() => setIsRadioSelected(true)}
        />
        <Radio
          title={t`Frequently Posts Unwanted Content`}
          value={t`Spam; excessive mentions or replies`}
          name="reportReason"
          onChange={() => setIsRadioSelected(true)}
        />
      </div>

      <div className="flex flex-col p-2">
        <TextArea
          label={t`Add details to report`}
          placeholder={t`Enter a reason or any other details here...`}
        />
      </div>
      <div className="flex justify-center">
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          onClick={() => {
            alert('gm 🚀' + currentProfile?.id);
          }}
          disabled={!isRadioSelected}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Report;
