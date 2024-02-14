import type { FC } from 'react';

import Link from 'next/link';

interface ListItemProps {
  link: string;
  title: string;
}

const ListItem: FC<ListItemProps> = ({ link, title }) => (
  <li>
    <Link className="underline" href={link} rel="noreferrer" target="_blank">
      {title}
    </Link>
  </li>
);

const Links: FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-2 md:gap-y-8">
      <div>
        <p className="mb-3 font-bold">Monitoring 📈</p>
        <ul className="linkify mb-4 mt-0 list-disc space-y-1 pl-5">
          <ListItem
            link="https://hey.metabaseapp.com/public/dashboard/3ee79f5b-07d7-43d7-9237-58c6442a1ad8#refresh=2"
            title="Leafwatch Overview"
          />
          <ListItem
            link="https://hey.metabaseapp.com/public/dashboard/060b9379-028c-4bb2-8d93-7927fcfed024#refresh=2"
            title="Leafwatch Impressions"
          />
          <ListItem
            link="https://railway.app/project/659c7f82-0d18-4593-807f-5348c495e3ef/logs"
            title="Live Railway Logs"
          />
        </ul>
      </div>
      <div>
        <p className="mb-4 font-bold">Other helpful links 🌱</p>
        <ul className="linkify mb-3 mt-0 list-disc space-y-1 pl-5">
          <ListItem
            link="https://heyxyz.zendesk.com/agent/dashboard"
            title="Zendesk Tickets"
          />
          <ListItem
            link="https://railway.app/project/659c7f82-0d18-4593-807f-5348c495e3ef"
            title="Railway"
          />
          <ListItem
            link="https://vercel.com/heyxyz/web/deployments"
            title="Vercel"
          />
        </ul>
      </div>
      <div>
        <p className="mb-4 font-bold">Forms 📜</p>
        <ul className="linkify mb-3 mt-0 list-disc space-y-1 pl-5">
          <ListItem
            link="https://hey.xyz/-/token-request"
            title="Token Allowlist Request"
          />
          <ListItem
            link="https://hey.xyz/-/verification-request"
            title="Verification Request"
          />
        </ul>
      </div>
    </div>
  );
};

export default Links;
