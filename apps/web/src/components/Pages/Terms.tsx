import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import Footer from '@components/Shared/Footer';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import { useEffectOnce } from 'usehooks-ts';

const Terms: NextPage = () => {
  const updatedAt = 'December 11, 2022';

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'terms' });
  });

  return (
    <>
      <MetaTags title={`Terms & Conditions • ${APP_NAME}`} />
      <div className="bg-brand-400 flex h-48 w-full items-center justify-center">
        <div className="relative text-center">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Terms & Conditions
          </h1>
          <div className="mt-4 flex justify-center">
            <div className="rounded-md bg-gray-800 px-2 py-0.5 text-xs text-white">
              Updated {updatedAt}
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="max-w-3/4 relative mx-auto rounded-lg sm:w-2/4">
            <div className="ld-text-gray-500 max-w-none !p-8">
              {/* 1. Overview beings */}
              <div className="mb-5 text-xl font-bold text-black dark:text-white">
                1. Overview
              </div>
              <div className="space-y-5 leading-7">
                <p>
                  The website hey.xyz” (the “Site”) offers information, tools
                  and services to you to allow you to interact with the Lens
                  Protocol - a composable and decentralised social graph
                  protocol.
                </p>
                <p>
                  By visiting the Site, you agree to be bound by the following
                  terms and conditions (“Terms”), including those additional
                  terms and conditions and policies referenced herein and/or
                  available by hyperlink (collectively, the “Agreement”). The
                  Agreement applies to all users of the Site, including without
                  limitation users who are browsers, builders, and/or
                  contributors of content.
                </p>
                <p>
                  Please read these Terms carefully before accessing or using
                  the Site. If you do not agree to all the terms of the
                  Agreement, then you should not access the Site; however, by
                  accessing the Site, you consent to the Agreement.
                </p>
                <p>
                  Any new features or tools which are added to Site shall also
                  be subject to the Terms. You can review the most current
                  version of the Terms at any time on this page. We reserve the
                  right to update, change or replace any part of these Terms by
                  posting updates and/or changes to our Site. It is your
                  responsibility to check this page periodically for changes.
                  Your continued use of or access to the Site following the
                  posting of any changes constitutes acceptance of those
                  changes.
                </p>
              </div>
              {/* 1. Overview ends */}
              {/* 2. General Conditions beings */}
              <div className="mb-5 mt-8 text-xl font-bold text-black dark:text-white">
                2. General Conditions
              </div>
              <p className="leading-7">
                You may not use our Site for any illegal or unauthorised purpose
                nor may you, in the use of the Service, violate any laws in your
                jurisdiction (including but not limited to copyright laws). We
                reserve the right to refuse the services to anyone for any
                reason at any time. We may stop (permanently or temporarily)
                providing the services or any features within the Site to you or
                to users generally.
              </p>
              {/* 2. General Conditions ends */}
              {/* 3. Services begins */}
              <div className="mb-5 mt-8 text-xl font-bold text-black dark:text-white">
                3. Services
              </div>
              <div className="space-y-5 leading-7">
                <p>
                  User Lens profile is referred as the “Profile” in the “Site”.
                </p>
                <p>
                  The Site allow you to interact with the Lens Protocol,
                  including posts, mirrors, comments and other content related
                  actions.
                </p>
                <p>
                  We reserve the right - but are not obligated to - limit the
                  provision of Profiles or Services to any person, geographic
                  region or jurisdiction. We may exercise this right on a
                  case-by-case basis in our sole discretion.
                </p>
                <ul className="list-inside list-disc space-y-3">
                  <li>Your profile your responsibility.</li>
                  <li>
                    You are responsible for securing the wallet that contains
                    your profiles.
                  </li>
                  <li>
                    You bear sole responsibility for evaluating the Site and
                    features before using them.
                  </li>
                </ul>
                <p>
                  It is important to understand that neither we nor any
                  affiliated entity is a party to any transaction on the
                  blockchain networks underlying the Lens Protocol; we do not
                  have possession, custody or control over any items on your
                  wallet and we do not have possession, custody, ability to
                  delete or control over any items on any user’s wallet or
                  interactions with the Lens Protocol.
                </p>
                <p>
                  If you’re not comfortable with interacting with an inherently
                  transparent blockchain, you should not engage with our Site to
                  create and manage a content on the Lens Protocol. You are
                  solely responsible for the safekeeping of the private key
                  associated with the blockchain address used to interact with
                  the Lens Protocol.{' '}
                  <b>
                    The transactions on blockchain including transfer of tokens
                    and data attached to it are permanent and cannot be undone.
                  </b>
                </p>
                <p>
                  Our Site allows you to upload a text, pictures, videos using
                  hosted on a third-party provider IPFS and Arweave. We are not
                  responsible for any action or omission taken by IPFS/Arweave
                  as it pertains to the user interface or otherwise. The use and
                  access of any third-party products or services, including
                  through the Site, is at your own risk.
                </p>
                <p>
                  The Lens Protocol is deployed on blockchain-based networks,
                  and we are not responsible for the operation of such networks.
                </p>
              </div>
              {/* 3. Services ends */}
              {/* 4. Accuracy, Completeness and Timeliness of information begins */}
              <div className="mb-5 mt-8 text-xl font-bold text-black dark:text-white">
                4. Accuracy, Completeness and Timeliness of information
              </div>
              <div className="space-y-5 leading-7">
                <p>
                  We are not responsible for any mistakes or inaccuracies on
                  contents published on this Site. Profiles are fully
                  responsible for what they are doing in the Site.
                </p>
                <p>
                  As a Site, we offer information about the content and
                  interaction on content published by the users on the Lens
                  Protocol.
                </p>
              </div>
              {/* 4. Accuracy, Completeness and Timeliness of information ends */}
              {/* 5. Modification of Services begins */}
              <div className="mb-5 mt-8 text-xl font-bold text-black dark:text-white">
                5. Modification of Services
              </div>
              <p className="leading-7">
                We reserve the right at any time to modify or discontinue the
                Site (or any part or content thereof) without notice at any
                time. We shall not be liable to you or any third-party for any
                modification, information change, suspension or discontinuance
                of the Site.
              </p>
              {/* 5. Modification of Services ends */}
              {/* 6. Third-Party Services & Websites begins */}
              <div className="mb-5 mt-8 text-xl font-bold text-black dark:text-white">
                6. Third-Party Services & Websites
              </div>
              <div className="space-y-5 leading-7">
                <p>
                  We are not responsible for the content or services of any
                  third-party, including, without limitation, any network, or
                  apps like Discord, or MetaMask, and we make no representations
                  regarding the content or accuracy of any third-party services
                  or materials. Those are governed by the terms of use of the
                  third-party providers.
                </p>
                <p>
                  Please review carefully the third-party's policies and
                  practices and make sure you understand them before you engage
                  in any transaction. Complaints, claims, concerns, or questions
                  regarding third-party products should be directed to the
                  third-party.
                </p>
              </div>
              {/* 6. Third-Party Services & Websites ends */}
              {/* 7. Personal Information begins */}
              <div className="mb-5 mt-8 text-xl font-bold text-black dark:text-white">
                7. Personal Information
              </div>
              <p className="linkify leading-7">
                Your submission of personal information through the Site is
                governed by our <Link href="/privacy">Privacy Policy</Link>.
              </p>
              {/* 7. Personal Information ends */}
              {/* 8. Prohibited Usage begins */}
              <div className="mb-5 mt-8 text-xl font-bold text-black dark:text-white">
                8. Prohibited Usage
              </div>
              <div className="space-y-5 leading-7">
                <p>
                  You are not allowed to use the Site for anything illegal,
                  infringing the intellectual property rights of other people,
                  harassment or otherwise abusive behaviour, spreading false
                  information or viruses, spamming, or interfering with the
                  security features of the Site.
                </p>
                <p>You are prohibited from using the Site,</p>
                <ul className="list-inside list-disc space-y-2">
                  <li>
                    for any unlawful purpose and to solicit others to perform or
                    participate in any unlawful acts;
                  </li>
                  <li>
                    to violate any international, federal, provincial or state
                    regulations, rules, laws, or local ordinances;
                  </li>
                  <li>
                    to infringe upon or violate our intellectual property rights
                    or the intellectual property rights of others;
                  </li>
                  <li>
                    to harass, abuse, insult, harm, defame, slander, disparage,
                    intimidate, or discriminate based on gender, sexual
                    orientation, religion, ethnicity, race, age, national
                    origin, or disability;
                  </li>
                  <li>
                    to submit false or misleading information or to upload or
                    transmit viruses or any other type of malicious code that
                    will or may be used in any way that will affect the
                    functionality or operation of the Site or of any related
                    website, other websites, or the Internet;
                  </li>
                  <li>
                    to collect or track the personal information of others to
                    spam, phish, pretext, crawl, or scrape;
                  </li>
                  <li>
                    for any obscene or immoral purpose or to interfere with or
                    circumvent the security features of the Site or any related
                    website, other websites, or the Internet. We reserve the
                    right to terminate your use of the Site or any related
                    website for violating any of the prohibited uses.
                  </li>
                </ul>
              </div>
              {/* 8. Prohibited Usage ends */}
              {/* 9. Assumption of Risk begins */}
              <div className="mb-5 mt-8 text-xl font-bold text-black dark:text-white">
                9. Assumption of Risk
              </div>
              <p className="leading-7">
                You assume the risks of using the Site (including the risks
                related to smart contracts). You are responsible for your
                wallet. We may restrict your access to the Site for any reason,
                including, but not limited, compliance with sanctions
                regulations.
              </p>
              {/* 9. Assumption of Risk ends */}
              {/* 10. Disclaimer of Warranties begins */}
              <div className="mb-5 mt-8 text-xl font-bold text-black dark:text-white">
                10. Disclaimer of Warranties
              </div>
              <p className="leading-7">
                The Site are provided to you completely as they are, and could
                function differently than you expected. You agree to accept the
                Site as is. You expressly agree that your use of, or inability
                to use, the Site is at your sole risk. Our liability shall be
                limited entirely or to the maximum extent permitted by law.
              </p>
              {/* 10. Disclaimer of Warranties ends */}
              {/* 11. Termination and Cancellation begins */}
              <div className="mb-5 mt-8 text-xl font-bold text-black dark:text-white">
                11. Termination and Cancellation
              </div>
              <div className="space-y-5 leading-7">
                <p>
                  This Agreement is effective unless and until terminated by
                  either you or us. You may terminate the Agreement with us at
                  any time by not accessing the Site.
                </p>
                <p>
                  If in our sole judgment you fail to comply with terms, we
                  reserve the right to terminate our Agreement with you and deny
                  you access to the Site.
                </p>
              </div>
              {/* 11. Termination and Cancellation ends */}
              {/* 12. Contact Information begins */}
              <div className="mb-5 mt-8 text-xl font-bold text-black dark:text-white">
                12. Contact Information
              </div>
              <p className="leading-7">
                Questions about the Terms should be sent to us at terms@hey.xyz
              </p>
              {/* 12. Contact Information ends */}
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

export default Terms;
