import {
  ProfileReportingFraudSubreason,
  ProfileReportingSpamSubreason
} from '@hey/lens';
import { Select } from '@hey/ui';
import { type Dispatch, type FC, type SetStateAction, useState } from 'react';

interface ReasonProps {
  setSubReason: Dispatch<SetStateAction<string>>;
  setType: Dispatch<SetStateAction<string>>;
  subReason: string;
  type: string;
}

const Reason: FC<ReasonProps> = ({
  setSubReason,
  setType,
  subReason,
  type
}) => {
  const [options] = useState({
    typeOptions: {
      default: [
        {
          disabled: true,
          label: 'Select type',
          selected: true,
          value: 'Select type'
        },
        {
          label: 'Fraud',
          selected: type === 'fraudReason',
          value: 'fraudReason'
        },
        {
          label: 'Spam',
          selected: type === 'spamReason',
          value: 'spamReason'
        }
      ],
      fraudReason: [
        {
          label: 'Impersonation',
          selected: subReason === ProfileReportingFraudSubreason.Impersonation,
          value: ProfileReportingFraudSubreason.Impersonation
        },
        {
          label: 'Something else',
          selected: subReason === ProfileReportingFraudSubreason.SomethingElse,
          value: ProfileReportingFraudSubreason.SomethingElse
        }
      ],
      spamReason: [
        {
          label: 'Repetitive',
          selected: subReason === ProfileReportingSpamSubreason.Repetitive,
          value: ProfileReportingSpamSubreason.Repetitive
        },
        {
          label: 'Something else',
          selected: subReason === ProfileReportingSpamSubreason.SomethingElse,
          value: ProfileReportingSpamSubreason.SomethingElse
        }
      ]
    }
  });

  return (
    <div className="space-y-3">
      <div>
        <div className="label">Type</div>
        <Select
          onChange={(e) => setType(e.target.value)}
          options={options.typeOptions.default}
        />
      </div>
      {type ? (
        <div>
          <div className="label">Reason</div>
          <Select
            onChange={(e) => setSubReason(e.target.value)}
            options={[
              {
                disabled: true,
                label: 'Select reason',
                selected: true,
                value: 'Select reason'
              },
              ...(type === 'fraudReason'
                ? options.typeOptions.fraudReason
                : []),
              ...(type === 'spamReason' ? options.typeOptions.spamReason : [])
            ]}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Reason;
