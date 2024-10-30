import MetaTags from "@components/Common/MetaTags";
import { APP_NAME } from "@hey/data/constants";
import { Card, GridItemTwelve, GridLayout, H3, PageLoading } from "@hey/ui";
import type { NextPage } from "next";
import Link from "next/link";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";

const Support: NextPage = () => {
  const { loading } = usePreferencesStore();

  if (loading) {
    return <PageLoading />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Support • ${APP_NAME}`} />
      <GridItemTwelve className="space-y-5">
        <Card className="flex flex-col items-center p-8">
          <div className="linkify max-w-xl text-center">
            <H3>Support</H3>
            <p className="mt-3">
              For assistance, please email us at{" "}
              <Link href="mailto:support@hey.xyz">support@hey.xyz</Link> with a
              detailed description of your issue and how we can assist you.
            </p>
            <ul className="my-5 space-y-2">
              <li>
                <Link href="/guidelines">Community Guidelines</Link>
              </li>
              <li>
                <Link href="/terms">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy">Hey Privacy Policy</Link>
              </li>
              <li>
                <Link
                  href="https://www.lens.xyz/legal/lens.xyz-privacy-policy.pdf"
                  target="_blank"
                >
                  Lens Protocol Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/copyright">Copyright Policy</Link>
              </li>
            </ul>
            <p className="mt-3 text-gray-500 text-sm">
              Send any legal requests to{" "}
              <Link href="mailto:legal@hey.xyz">legal@hey.xyz</Link>
            </p>
          </div>
        </Card>
      </GridItemTwelve>
    </GridLayout>
  );
};

export default Support;
