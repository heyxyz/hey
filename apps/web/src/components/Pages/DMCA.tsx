import MetaTags from '@components/Common/MetaTags';
import Footer from '@components/Shared/Footer';
import { APP_NAME } from '@lenster/data/constants';
import { PAGEVIEW } from '@lenster/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useEffectOnce } from 'usehooks-ts';

const DMCA: FC = () => {
  const updatedAt = 'August 03, 2023';

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'dmca' });
  });

  return (
    <>
      <MetaTags
        title={t`Digital Millennium Copyright Act (DMCA) • ${APP_NAME}`}
      />
      <div className="bg-brand-400 flex h-48 w-full items-center justify-center">
        <div className="relative text-center">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            <Trans>Digital Millennium Copyright Act (DMCA) for Lenster</Trans>
          </h1>
          <div className="mt-4 flex justify-center">
            <div className="rounded-md bg-gray-800 px-2 py-0.5 text-xs text-white">
              <Trans>Updated {updatedAt}</Trans>
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="max-w-3/4 relative mx-auto rounded-lg sm:w-2/4">
            <div className="lt-text-gray-500 max-w-none !p-8">
              {/* 1. Introduction begins */}
              <div className="mb-5 text-xl font-bold text-black dark:text-white">
                <Trans>1. Introduction</Trans>
              </div>
              <div className="space-y-5 leading-7">
                <p>
                  <Trans>
                    Lenster is a decentralized and permissionless social media
                    app built with Lens Protocol. Our goal is to provide users
                    with a secure and private platform where they can freely
                    express themselves and communicate with others. However, we
                    also respect intellectual property rights and adhere to the
                    provisions of the Digital Millennium Copyright Act (DMCA).
                    As a result, this DMCA notice is meant to inform all Lenster
                    users of their obligations and rights regarding copyrighted
                    content. By using Lenster, you agree to comply with the DMCA
                    and acknowledge the consequences of any infringement.
                  </Trans>
                </p>
              </div>
              {/* 1. Introduction ends */}
              {/* 2. Copyright Infringement begins */}
              <div className="mb-5 mt-8 text-xl font-bold text-black dark:text-white">
                <Trans>2. Copyright Infringement</Trans>
              </div>
              <p className="leading-7">
                <Trans>
                  As a user of Lenster, you must not engage in any activity that
                  infringes upon the copyrights of others. This includes, but is
                  not limited to, sharing, posting, or uploading copyrighted
                  content without proper authorization from the copyright owner.
                  If you believe that your copyrighted work has been used or
                  shared on Lenster without your permission, you may submit a
                  DMCA takedown notice to our designated agent.
                </Trans>
              </p>
              {/* 2. Copyright Infringement ends */}
              {/* 3. Filing a DMCA Takedown Notice begins */}
              <div className="mb-5 mt-8 text-xl font-bold text-black dark:text-white">
                <Trans>3. Filing a DMCA Takedown Notice</Trans>
              </div>
              <div className="space-y-5 leading-7">
                <p>
                  <Trans>
                    To file a DMCA takedown notice, please provide the following
                    information to our designated agent:
                  </Trans>
                </p>
                <ul className="list-inside list-disc space-y-2">
                  <li>
                    Identification of the copyrighted work you claim has been
                    infringed, or a representative list of such works.
                  </li>
                  <li>
                    Identification of the material that is claimed to be
                    infringing or to be the subject of infringing activity and
                    that is to be removed or access to which is to be disabled,
                    including a description and URL where it is located.
                  </li>
                  <li>
                    Your contact information, including your name, address,
                    telephone number, and email address.
                  </li>
                  <li>
                    A statement that you have a good faith belief that the use
                    of the material in the manner complained of is not
                    authorized by the copyright owner, its agent, or the law.
                  </li>
                  <li>
                    A statement, made under penalty of perjury, that the
                    information provided in your notice is accurate and that you
                    are the copyright owner or authorized to act on behalf of
                    the owner.
                  </li>
                  <li>
                    An electronic or physical signature of the person authorized
                    to act on behalf of the copyright owner.
                  </li>
                  <li>
                    Your designated agent's name and contact information,
                    including email address
                  </li>
                </ul>
              </div>
              {/* 3. Filing a DMCA Takedown Notice ends */}
              {/* 4. Counter-Notification begins */}
              <div className="mb-5 mt-8 text-xl font-bold text-black dark:text-white">
                <Trans>4. Counter-Notification</Trans>
              </div>
              <div className="space-y-5 leading-7">
                <p>
                  <Trans>
                    If you believe that your content was removed in error, you
                    may file a counter-notification with our designated agent.
                    To do so, please provide the following information:
                  </Trans>
                </p>
                <ul className="list-inside list-disc space-y-2">
                  <li>
                    <Trans>
                      Identification of the material that has been removed or to
                      which access has been disabled and the location at which
                      the material appeared before it was removed or access was
                      disabled. Your contact information, including your name,
                      address, telephone number, and email address.
                    </Trans>
                  </li>
                  <li>
                    <Trans>
                      A statement, made under penalty of perjury, that you have
                      a good faith belief that the material was removed or
                      disabled as a result of mistake or misidentification of
                      the material to be removed or disabled.
                    </Trans>
                  </li>
                  <li>
                    <Trans>
                      A statement that you consent to the jurisdiction of the
                      federal court in the district where you reside (or, if you
                      reside outside of the United States, the jurisdiction of a
                      United States District Court in which your address is
                      located) and that you will accept service of process from
                      the person who provided the DMCA takedown notice or their
                      agent.
                    </Trans>
                  </li>
                  <li>
                    <Trans>Your electronic or physical signature.</Trans>
                  </li>
                </ul>
                <p>
                  <Trans>
                    Upon receipt of a valid counter-notification, we will
                    forward it to the person who submitted the original takedown
                    notice. If they do not respond within 14 business days, we
                    may restore the removed content.
                  </Trans>
                </p>
              </div>
              {/* 4. Counter-Notification ends */}
              {/* 5. Disclaimer begins */}
              <div className="mb-5 mt-8 text-xl font-bold text-black dark:text-white">
                <Trans>5. Disclaimer</Trans>
              </div>
              <p className="leading-7">
                <Trans>
                  Please note that filing a false DMCA takedown notice or
                  counter-notification may result in legal consequences.
                </Trans>
              </p>
              <p className="leading-7">
                <Trans>
                  We encourage you to consult with an attorney if you have
                  questions about your rights under the DMCA.
                </Trans>
              </p>
              {/* 5. Disclaimer ends */}
            </div>
          </div>
        </div>
        <div className="flex justify-center pb-6 pt-2">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default DMCA;
