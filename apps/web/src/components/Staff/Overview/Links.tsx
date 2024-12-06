import Link from "next/link";
import type { FC } from "react";

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
        <ul className="mt-0 mb-4 list-disc space-y-1 pl-5">
          <ListItem
            link="https://railway.app/project/659c7f82-0d18-4593-807f-5348c495e3ef/logs"
            title="Live Railway Logs"
          />
        </ul>
      </div>
      <div>
        <p className="mb-4 font-bold">Other helpful links 🌱</p>
        <ul className="mt-0 mb-3 list-disc space-y-1 pl-5">
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
        <ul className="mt-0 mb-3 list-disc space-y-1 pl-5">
          <ListItem
            link="https://hey.xyz/-/token-request"
            title="Token Allowlist Request"
          />
        </ul>
      </div>
    </div>
  );
};

export default Links;
