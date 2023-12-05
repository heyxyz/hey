import type { Dispatch, FC, SetStateAction } from 'react';

import {
  PublicationReportingFraudSubreason,
  PublicationReportingIllegalSubreason,
  PublicationReportingSensitiveSubreason,
  PublicationReportingSpamSubreason
} from '@hey/lens';

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
  return (
    <div className="space-y-3">
      <div>
        <div className="label">Type</div>
        <div>
          <select
            className="focus:border-brand-500 focus:ring-brand-400 w-full rounded-xl border border-gray-300 bg-white outline-none dark:border-gray-700 dark:bg-gray-800"
            onChange={(e) => setType(e.target.value)}
          >
            <option disabled selected>
              Select type
            </option>
            <option selected={type === 'illegalReason'} value="illegalReason">
              Illegal
            </option>
            <option selected={type === 'fraudReason'} value="fraudReason">
              Fraud
            </option>
            <option
              selected={type === 'sensitiveReason'}
              value="sensitiveReason"
            >
              Sensitive
            </option>
            <option selected={type === 'spamReason'} value="spamReason">
              Spam
            </option>
          </select>
        </div>
      </div>
      {type ? (
        <div>
          <div className="label">Reason</div>
          <div>
            <select
              className="focus:border-brand-500 focus:ring-brand-400 w-full rounded-xl border border-gray-300 bg-white outline-none dark:border-gray-700 dark:bg-gray-800"
              onChange={(e) => setSubReason(e.target.value)}
            >
              <option disabled selected>
                Select sub reason
              </option>
              {type === 'illegalReason' ? (
                <>
                  <option
                    selected={
                      subReason ===
                      PublicationReportingIllegalSubreason.AnimalAbuse
                    }
                    value={PublicationReportingIllegalSubreason.AnimalAbuse}
                  >
                    Animal Abuse
                  </option>
                  <option
                    selected={
                      subReason ===
                      PublicationReportingIllegalSubreason.DirectThreat
                    }
                    value={PublicationReportingIllegalSubreason.DirectThreat}
                  >
                    Direct Threat
                  </option>
                  <option
                    selected={
                      subReason ===
                      PublicationReportingIllegalSubreason.HumanAbuse
                    }
                    value={PublicationReportingIllegalSubreason.HumanAbuse}
                  >
                    Human Abuse
                  </option>
                  <option
                    selected={
                      subReason ===
                      PublicationReportingIllegalSubreason.ThreatIndividual
                    }
                    value={
                      PublicationReportingIllegalSubreason.ThreatIndividual
                    }
                  >
                    Threat Individual
                  </option>
                  <option
                    selected={
                      subReason ===
                      PublicationReportingIllegalSubreason.Violence
                    }
                    value={PublicationReportingIllegalSubreason.Violence}
                  >
                    Violence
                  </option>
                </>
              ) : null}
              {type === 'fraudReason' ? (
                <>
                  <option
                    selected={
                      subReason === PublicationReportingFraudSubreason.Scam
                    }
                    value={PublicationReportingFraudSubreason.Scam}
                  >
                    Scam
                  </option>
                  <option
                    selected={
                      subReason ===
                      PublicationReportingFraudSubreason.Impersonation
                    }
                    value={PublicationReportingFraudSubreason.Impersonation}
                  >
                    Impersonation
                  </option>
                </>
              ) : null}
              {type === 'sensitiveReason' ? (
                <>
                  <option
                    selected={
                      subReason === PublicationReportingSensitiveSubreason.Nsfw
                    }
                    value={PublicationReportingSensitiveSubreason.Nsfw}
                  >
                    NSFW
                  </option>
                  <option
                    selected={
                      subReason ===
                      PublicationReportingSensitiveSubreason.Offensive
                    }
                    value={PublicationReportingSensitiveSubreason.Offensive}
                  >
                    Offensive
                  </option>
                </>
              ) : null}
              {type === 'spamReason' ? (
                <>
                  <option
                    selected={
                      subReason ===
                      PublicationReportingSpamSubreason.FakeEngagement
                    }
                    value={PublicationReportingSpamSubreason.FakeEngagement}
                  >
                    Fake engagement
                  </option>
                  <option
                    selected={
                      subReason === PublicationReportingSpamSubreason.LowSignal
                    }
                    value={PublicationReportingSpamSubreason.LowSignal}
                  >
                    Low signal
                  </option>
                  <option
                    selected={
                      subReason ===
                      PublicationReportingSpamSubreason.ManipulationAlgo
                    }
                    value={PublicationReportingSpamSubreason.ManipulationAlgo}
                  >
                    Algorithm manipulation
                  </option>
                  <option
                    selected={
                      subReason === PublicationReportingSpamSubreason.Misleading
                    }
                    value={PublicationReportingSpamSubreason.Misleading}
                  >
                    Misleading
                  </option>
                  <option
                    selected={
                      subReason ===
                      PublicationReportingSpamSubreason.MisuseHashtags
                    }
                    value={PublicationReportingSpamSubreason.MisuseHashtags}
                  >
                    Misuse hashtags
                  </option>
                  <option
                    selected={
                      subReason === PublicationReportingSpamSubreason.Repetitive
                    }
                    value={PublicationReportingSpamSubreason.Repetitive}
                  >
                    Repetitive
                  </option>
                  <option
                    selected={
                      subReason ===
                      PublicationReportingSpamSubreason.SomethingElse
                    }
                    value={PublicationReportingSpamSubreason.SomethingElse}
                  >
                    Something else
                  </option>
                  <option
                    selected={
                      subReason === PublicationReportingSpamSubreason.Unrelated
                    }
                    value={PublicationReportingSpamSubreason.Unrelated}
                  >
                    Unrelated
                  </option>
                </>
              ) : null}
            </select>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Reason;
