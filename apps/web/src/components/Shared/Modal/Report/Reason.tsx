import { Trans } from '@lingui/macro';
import {
  PublicationReportingFraudSubreason,
  PublicationReportingIllegalSubreason,
  PublicationReportingSensitiveSubreason,
  PublicationReportingSpamSubreason
} from 'lens';
import type { Dispatch, FC } from 'react';

interface Props {
  setType: Dispatch<string>;
  setSubReason: Dispatch<string>;
  type: string;
  subReason: string;
}

const Reason: FC<Props> = ({ setType, setSubReason, type, subReason }) => {
  return (
    <div className="space-y-3">
      <div>
        <div className="label">Type</div>
        <div>
          <select
            className="focus:border-brand-500 focus:ring-brand-400 w-full rounded-xl border border-gray-300 bg-white outline-none disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800"
            onChange={(e) => setType(e.target.value)}
          >
            <option disabled selected>
              <Trans>Select type</Trans>
            </option>
            <option value="illegalReason" selected={type === 'illegalReason'}>
              <Trans>Illegal</Trans>
            </option>
            <option value="fraudReason" selected={type === 'fraudReason'}>
              <Trans>Fraud</Trans>
            </option>
            <option value="sensitiveReason" selected={type === 'sensitiveReason'}>
              <Trans>Sensitive</Trans>
            </option>
            <option value="spamReason" selected={type === 'spamReason'}>
              <Trans>Spam</Trans>
            </option>
          </select>
        </div>
      </div>
      {type && (
        <div>
          <div className="label">
            <Trans>Reason</Trans>
          </div>
          <div>
            <select
              className="focus:border-brand-500 focus:ring-brand-400 w-full rounded-xl border border-gray-300 bg-white outline-none disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800"
              onChange={(e) => setSubReason(e.target.value)}
            >
              <option disabled selected>
                <Trans>Select sub reason</Trans>
              </option>
              {type === 'illegalReason' && (
                <>
                  <option
                    value={PublicationReportingIllegalSubreason.AnimalAbuse}
                    selected={subReason === PublicationReportingIllegalSubreason.AnimalAbuse}
                  >
                    <Trans>Animal Abuse</Trans>
                  </option>
                  <option
                    value={PublicationReportingIllegalSubreason.DirectThreat}
                    selected={subReason === PublicationReportingIllegalSubreason.DirectThreat}
                  >
                    <Trans>Direct Threat</Trans>
                  </option>
                  <option
                    value={PublicationReportingIllegalSubreason.HumanAbuse}
                    selected={subReason === PublicationReportingIllegalSubreason.HumanAbuse}
                  >
                    <Trans>Human Abuse</Trans>
                  </option>
                  <option
                    value={PublicationReportingIllegalSubreason.ThreatIndividual}
                    selected={subReason === PublicationReportingIllegalSubreason.ThreatIndividual}
                  >
                    <Trans>Threat Individual</Trans>
                  </option>
                  <option
                    value={PublicationReportingIllegalSubreason.Violence}
                    selected={subReason === PublicationReportingIllegalSubreason.Violence}
                  >
                    <Trans>Violence</Trans>
                  </option>
                </>
              )}
              {type === 'fraudReason' && (
                <>
                  <option
                    value={PublicationReportingFraudSubreason.Scam}
                    selected={subReason === PublicationReportingFraudSubreason.Scam}
                  >
                    <Trans>Scam</Trans>
                  </option>
                  <option
                    value={PublicationReportingFraudSubreason.Impersonation}
                    selected={subReason === PublicationReportingFraudSubreason.Impersonation}
                  >
                    <Trans>Impersonation</Trans>
                  </option>
                </>
              )}
              {type === 'sensitiveReason' && (
                <>
                  <option
                    value={PublicationReportingSensitiveSubreason.Nsfw}
                    selected={subReason === PublicationReportingSensitiveSubreason.Nsfw}
                  >
                    <Trans>NSFW</Trans>
                  </option>
                  <option
                    value={PublicationReportingSensitiveSubreason.Offensive}
                    selected={subReason === PublicationReportingSensitiveSubreason.Offensive}
                  >
                    <Trans>Offensive</Trans>
                  </option>
                </>
              )}
              {type === 'spamReason' && (
                <>
                  <option
                    value={PublicationReportingSpamSubreason.FakeEngagement}
                    selected={subReason === PublicationReportingSpamSubreason.FakeEngagement}
                  >
                    <Trans>Fake engagement</Trans>
                  </option>
                  <option
                    value={PublicationReportingSpamSubreason.ManipulationAlgo}
                    selected={subReason === PublicationReportingSpamSubreason.ManipulationAlgo}
                  >
                    <Trans>Algorithm manipulation</Trans>
                  </option>
                  <option
                    value={PublicationReportingSpamSubreason.Misleading}
                    selected={subReason === PublicationReportingSpamSubreason.Misleading}
                  >
                    <Trans>Misleading</Trans>
                  </option>
                  <option
                    value={PublicationReportingSpamSubreason.MisuseHashtags}
                    selected={subReason === PublicationReportingSpamSubreason.MisuseHashtags}
                  >
                    <Trans>Misuse hashtags</Trans>
                  </option>
                  <option
                    value={PublicationReportingSpamSubreason.Repetitive}
                    selected={subReason === PublicationReportingSpamSubreason.Repetitive}
                  >
                    <Trans>Repetitive</Trans>
                  </option>
                  <option
                    value={PublicationReportingSpamSubreason.SomethingElse}
                    selected={subReason === PublicationReportingSpamSubreason.SomethingElse}
                  >
                    <Trans>Something else</Trans>
                  </option>
                  <option
                    value={PublicationReportingSpamSubreason.Unrelated}
                    selected={subReason === PublicationReportingSpamSubreason.Unrelated}
                  >
                    <Trans>Unrelated</Trans>
                  </option>
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
