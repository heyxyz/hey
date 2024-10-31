import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { MISCELLANEOUS } from "@hey/data/tracking";
import cn from "@hey/ui/cn";
import { useFlag } from "@unleash/proxy-client-react";
import Link from "next/link";
import type { FC } from "react";

const currentYear = new Date().getFullYear();

const links = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/guidelines", label: "Guidelines" },
  {
    href: "https://hey.xyz/discord",
    label: "Discord",
    onClick: () => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_DISCORD)
  },
  {
    href: "/u/hey",
    label: APP_NAME,
    onClick: () => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_HEY)
  },
  {
    href: "https://status.hey.xyz",
    label: "Status",
    onClick: () => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_STATUS)
  },
  {
    href: "https://github.com/heyxyz/hey",
    label: "GitHub",
    onClick: () => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_GITHUB)
  },
  { href: "/support", label: "Support" }
];

const Footer: FC = () => {
  const isStaff = useFlag(FeatureFlag.Staff);

  return (
    <footer
      className={cn(
        isStaff ? "top-28" : "top-20",
        "sticky mt-4 flex flex-wrap gap-x-[12px] gap-y-2 px-3 text-sm lg:px-0"
      )}
    >
      <span className="ld-text-gray-500 font-bold">
        &copy; {currentYear} {APP_NAME}.xyz
      </span>
      {links.map((link) => (
        <Link
          className="outline-offset-4"
          href={link.href}
          key={link.href}
          onClick={link.onClick}
          rel="noreferrer noopener"
          target={link.href.startsWith("http") ? "_blank" : undefined}
        >
          {link.label}
        </Link>
      ))}
    </footer>
  );
};

export default Footer;
