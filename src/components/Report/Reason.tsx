import React, { Dispatch, FC } from 'react';

interface Props {
  setType: Dispatch<string>;
  setSubReason: Dispatch<string>;
  type: string;
}

const Reason: FC<Props> = ({ setType, setSubReason, type }) => {
  return (
    <div className="space-y-3">
      <div>
        <div className="label">Type</div>
        <div>
          <select
            className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
            onChange={(e) => setType(e.target.value)}
          >
            <option disabled selected>
              Select type
            </option>
            <option value="illegalReason">Illegal</option>
            <option value="fraudReason">Fraud</option>
            <option value="sensitiveReason">Sensitive</option>
          </select>
        </div>
      </div>
      {type && (
        <div>
          <div className="label">Reason</div>
          <div>
            <select
              className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
              onChange={(e) => setSubReason(e.target.value)}
            >
              <option disabled selected>
                Select sub reason
              </option>
              {type === 'illegalReason' && (
                <>
                  <option value="ANIMAL_ABUSE">Animal Abuse</option>
                  <option value="HUMAN_ABUSE">Human Abuse</option>
                </>
              )}
              {type === 'fraudReason' && (
                <>
                  <option value="SCAM">Scam</option>
                  <option value="IMPERSONATION">Impersonation</option>
                </>
              )}
              {type === 'sensitiveReason' && (
                <>
                  <option value="NSFW">NSWF</option>
                  <option value="OFFENSIVE">Offensive</option>
                </>
              )}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reason;
