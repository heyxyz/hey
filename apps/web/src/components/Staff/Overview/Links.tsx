import { PAGEVIEW } from '@hey/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import type { FC } from 'react';
import Custom404 from 'src/pages/404';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';

interface ListItemProps {
  title: string;
  link: string;
}

const ListItem: FC<ListItemProps> = ({ title, link }) => (
  <li>
    <Link href={link} target="_blank" rel="noreferrer" className="underline">
      {title}
    </Link>
  </li>
);

const Links: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const staffMode = useFeatureFlagsStore((state) => state.staffMode);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'staff-tools', subpage: 'overview' });
  });

  if (!currentProfile || !staffMode) {
    return <Custom404 />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-2 md:gap-y-8">
      <div>
        <p className="mb-3 font-bold">Monitoring 📈</p>
        <ul className="linkify mb-4 mt-0 list-disc space-y-1 pl-5">
          <ListItem
            title="Leafwatch Overview"
            link="https://hey.metabaseapp.com/public/dashboard/3ee79f5b-07d7-43d7-9237-58c6442a1ad8#refresh=2"
          />
          <ListItem
            title="Leafwatch Impressions"
            link="https://hey.metabaseapp.com/public/dashboard/060b9379-028c-4bb2-8d93-7927fcfed024#refresh=2"
          />
          <ListItem
            title="Live Railway Logs"
            link="https://railway.app/project/659c7f82-0d18-4593-807f-5348c495e3ef/logs"
          />
        </ul>
      </div>
      <div>
        <p className="mb-4 font-bold">Other helpful links 🌱</p>
        <ul className="linkify mb-3 mt-0 list-disc space-y-1 pl-5">
          <ListItem
            title="Railway"
            link="https://railway.app/project/659c7f82-0d18-4593-807f-5348c495e3ef"
          />
          <ListItem
            title="Vercel"
            link="https://vercel.com/heyxyz/web/deployments"
          />
        </ul>
      </div>
      <div>
        <p className="mb-4 font-bold">Forms 📜</p>
        <ul className="linkify mb-3 mt-0 list-disc space-y-1 pl-5">
          <ListItem
            title="Token Allowlist Request"
            link="https://hey.xyz/-/token-request"
          />
          <ListItem
            title="Verification Request"
            link="https://hey.xyz/-/verification-request"
          />
        </ul>
      </div>
    </div>
  );
};

export default Links;
