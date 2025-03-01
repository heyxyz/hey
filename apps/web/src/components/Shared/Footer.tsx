import { APP_NAME } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { Modal } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useFlag } from "@unleash/proxy-client-react";
import Link from "next/link";
import type { FC } from "react";
import { useState } from "react";
import TipHey from "./Modal/TipHey";
const currentYear = new Date().getFullYear();

const links = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/guidelines", label: "Guidelines" },
  {
    href: "https://hey.xyz/discord",
    label: "Discord"
  },
  {
    href: "/u/hey",
    label: APP_NAME
  },
  {
    href: "https://status.hey.xyz",
    label: "Status"
  },
  {
    href: "https://github.com/heyverse/hey",
    label: "GitHub"
  },
  { href: "/support", label: "Support" }
];

const Footer: FC = () => {
  const isStaff = useFlag(FeatureFlag.Staff);
  const [showTipModal, setShowTipModal] = useState(false);

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
      <button
        type="button"
        className="font-bold text-green-600"
        onClick={() => setShowTipModal(true)}
      >
        Tip
      </button>
      {links.map((link) => (
        <Link
          className="outline-offset-4"
          href={link.href}
          key={link.href}
          rel="noreferrer noopener"
          target={link.href.startsWith("http") ? "_blank" : undefined}
        >
          {link.label}
        </Link>
      ))}
      <Modal
        title="Tip"
        show={showTipModal}
        onClose={() => setShowTipModal(false)}
      >
        <TipHey onTip={() => setShowTipModal(false)} />
      </Modal>
    </footer>
  );
};

export default Footer;
