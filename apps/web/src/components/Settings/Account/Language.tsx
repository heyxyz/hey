import { Card } from '@components/UI/Card';
import { setLocale, supportedLocales } from '@lib/i18n';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { FC } from 'react';

dayjs.extend(relativeTime);

const Language: FC = () => {
  const { i18n } = useLingui();

  return (
    <Card className="space-y-5 p-5">
      <div className="text-lg font-bold">
        <Trans>Locale settings</Trans>
      </div>
      <div className="pt-2">
        <div className="label">
          <Trans>Select display language</Trans>
        </div>
        <select
          value={i18n.locale}
          className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-400"
          onChange={(e) => {
            const langCode = e.target.value;
            setLocale(langCode);
          }}
        >
          {Object.entries(supportedLocales).map(([localeCode, localeName]) => (
            <option key={localeCode} value={localeCode}>
              {localeName}
            </option>
          ))}
        </select>
      </div>
    </Card>
  );
};

export default Language;
