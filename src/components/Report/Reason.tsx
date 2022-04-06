import React, { Dispatch } from 'react'

interface Props {
  setType: Dispatch<string>
  setSubReason: Dispatch<string>
  type: string
}

const Reason: React.FC<Props> = ({ setType, setSubReason, type }) => {
  const Label = ({ children }: { children: React.ReactChild }) => (
    <div className="mb-1 font-medium text-gray-800 dark:text-gray-200">
      {children}
    </div>
  )

  return (
    <div className="space-y-3">
      <div>
        <Label>Type</Label>
        <div>
          <select
            className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 dark:border-gray-700 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 focus:border-brand-500 focus:ring-brand-400"
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
          <Label>Reason</Label>
          <div>
            <select
              className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 dark:border-gray-700 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 focus:border-brand-500 focus:ring-brand-400"
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
  )
}

export default Reason
