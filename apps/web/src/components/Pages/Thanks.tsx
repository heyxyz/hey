import Footer from "@components/Shared/Footer";
import { HeartIcon } from "@heroicons/react/24/solid";
import { APP_NAME, STATIC_IMAGES_URL } from "@hey/data/constants";
import { H2 } from "@hey/ui";
import type { NextPage } from "next";
import { useTheme } from "next-themes";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import urlcat from "urlcat";

interface BrandProps {
  children: ReactNode;
  logo: string;
  name: string;
  size: number;
  type: "png" | "svg";
  url: string;
}

const Brand: FC<BrandProps> = ({ children, logo, name, size, type, url }) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="space-y-5 pt-10">
      <img
        alt={`${name}'s Logo`}
        className="mx-auto"
        src={`${STATIC_IMAGES_URL}/thanks/${logo}-${
          resolvedTheme === "dark" ? "dark" : "light"
        }.${type}`}
        style={{ height: size }}
      />
      <div className="mx-auto pt-2 sm:w-2/3">{children}</div>
      <div>
        <Link
          className="font-bold"
          href={url}
          rel="noreferrer noopener"
          target="_blank"
        >
          ➜ Go to {name}
        </Link>
      </div>
    </div>
  );
};

const Thanks: NextPage = () => {
  return (
    <>
      <div className="flex h-48 w-full items-center justify-center bg-gray-400">
        <div className="relative text-center">
          <div className="flex items-center space-x-2 text-white">
            <H2>Thank you!</H2>
            <HeartIcon className="size-7 text-brand-500" />
          </div>
          <div className="text-white">for supporting our community</div>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto max-w-3/4 rounded-lg lg:w-2/4">
            <div className="max-w-none space-y-10 divide-y px-5 pb-10 text-center text-gray-900 dark:divide-gray-700 dark:text-gray-200">
              <Brand
                logo="vercel"
                name="Vercel"
                size={40}
                type="svg"
                url={urlcat("https://vercel.com", {
                  utm_campaign: "oss",
                  utm_source: APP_NAME
                })}
              >
                Vercel combines the best developer experience with an obsessive
                focus on end-profile performance. Vercel platform enables
                frontend teams to do their best work.
              </Brand>
              <Brand
                logo="4everland"
                name="4EVERLAND"
                size={50}
                type="png"
                url={urlcat("https://4everland.org", { utm_source: APP_NAME })}
              >
                4EVERLAND is a Web 3.0 cloud computing platform that integrates
                storage, computing, and network core capabilities.
              </Brand>
            </div>
          </div>
        </div>
        <div className="flex justify-center px-5 pt-2 pb-6">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Thanks;
