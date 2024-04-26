import type { NextPage } from 'next';

import Footer from '@components/Shared/Footer';
import { Leafwatch } from '@helpers/leafwatch';
import showCrisp from '@helpers/showCrisp';
import { PAGEVIEW } from '@hey/data/tracking';
import Link from 'next/link';
import { useEffect } from 'react';

const Terms: NextPage = () => {
  const updatedAt = 'February 15, 2024';

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'terms' });
  }, []);

  return (
    <>
      <div className="flex h-48 w-full items-center justify-center bg-gray-400">
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
              <div className="mb-5 text-xl font-bold">1. Overview</div>
              <div className="space-y-5">
                <p className="leading-7">
                  The website hey.xyz” (the “Site”) offers information, tools
                  and services to you to allow you to interact with the Lens
                  Protocol - a composable and decentralised social graph
                  protocol.
                </p>
                <p className="leading-7">
                  By visiting the Site, you agree to be bound by the following
                  terms and conditions (“Terms”), including those additional
                  terms and conditions and policies referenced herein and/or
                  available by hyperlink (collectively, the “Agreement”). The
                  Agreement applies to all users of the Site, including without
                  limitation users who are browsers, builders, and/or
                  contributors of content.
                </p>
                <p className="leading-7">
                  Please read these Terms carefully before accessing or using
                  the Site. If you do not agree to all the terms of the
                  Agreement, then you should not access the Site; however, by
                  accessing the Site, you consent to the Agreement.
                </p>
                <p className="leading-7">
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
              <div className="mb-5 mt-8 text-xl font-bold">
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
              <div className="mb-5 mt-8 text-xl font-bold">3. Services</div>
              <div className="space-y-5">
                <p className="leading-7">
                  User Lens profile is referred as the “Profile” in the “Site”.
                </p>
                <p className="leading-7">
                  The Site allow you to interact with the Lens Protocol,
                  including posts, mirrors, comments and other content related
                  actions.
                </p>
                <p className="leading-7">
                  We reserve the right - but are not obligated to - limit the
                  provision of Profiles or Services to any person, geographic
                  region or jurisdiction. We may exercise this right on a
                  case-by-case basis in our sole discretion.
                </p>
                <ul className="list-inside list-disc space-y-3">
                  <li className="leading-7">
                    Your profile your responsibility.
                  </li>
                  <li className="leading-7">
                    You are responsible for securing the wallet that contains
                    your profiles.
                  </li>
                  <li className="leading-7">
                    You bear sole responsibility for evaluating the Site and
                    features before using them.
                  </li>
                </ul>
                <p className="leading-7">
                  It is important to understand that neither we nor any
                  affiliated entity is a party to any transaction on the
                  blockchain networks underlying the Lens Protocol; we do not
                  have possession, custody or control over any items on your
                  wallet and we do not have possession, custody, ability to
                  delete or control over any items on any user’s wallet or
                  interactions with the Lens Protocol.
                </p>
                <p className="leading-7">
                  If you’re not comfortable with interacting with an inherently
                  transparent blockchain, you should not engage with our Site to
                  create and manage a content on the Lens Protocol. You are
                  solely responsible for the safekeeping of the private key
                  associated with the blockchain address used to interact with
                  the Lens Protocol.{' '}
                  <b className="leading-7">
                    The transactions on blockchain including transfer of tokens
                    and data attached to it are permanent and cannot be undone.
                  </b>
                </p>
                <p className="leading-7">
                  Our Site allows you to upload a text, pictures, videos using
                  hosted on a third-party provider IPFS and Arweave. We are not
                  responsible for any action or omission taken by IPFS/Arweave
                  as it pertains to the user interface or otherwise. The use and
                  access of any third-party products or services, including
                  through the Site, is at your own risk.
                </p>
                <p className="leading-7">
                  The Lens Protocol is deployed on blockchain-based networks,
                  and we are not responsible for the operation of such networks.
                </p>
              </div>
              {/* 3. Services ends */}
              {/* 4. Accuracy, Completeness and Timeliness of information begins */}
              <div className="mb-5 mt-8 text-xl font-bold">
                4. Accuracy, Completeness and Timeliness of information
              </div>
              <div className="space-y-5">
                <p className="leading-7">
                  We are not responsible for any mistakes or inaccuracies on
                  contents published on this Site. Profiles are fully
                  responsible for what they are doing in the Site.
                </p>
                <p className="leading-7">
                  As a Site, we offer information about the content and
                  interaction on content published by the users on the Lens
                  Protocol.
                </p>
              </div>
              {/* 4. Accuracy, Completeness and Timeliness of information ends */}
              {/* 5. Modification of Services begins */}
              <div className="mb-5 mt-8 text-xl font-bold">
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
              <div className="mb-5 mt-8 text-xl font-bold">
                6. Third-Party Services & Websites
              </div>
              <div className="space-y-5">
                <p className="leading-7">
                  We are not responsible for the content or services of any
                  third-party, including, without limitation, any network, or
                  apps like Discord, or MetaMask, and we make no representations
                  regarding the content or accuracy of any third-party services
                  or materials. Those are governed by the terms of use of the
                  third-party providers.
                </p>
                <p className="leading-7">
                  Please review carefully the third-party's policies and
                  practices and make sure you understand them before you engage
                  in any transaction. Complaints, claims, concerns, or questions
                  regarding third-party products should be directed to the
                  third-party.
                </p>
              </div>
              {/* 6. Third-Party Services & Websites ends */}
              {/* 7. Personal Information begins */}
              <div className="mb-5 mt-8 text-xl font-bold">
                7. Personal Information
              </div>
              <p className="linkify leading-7">
                Your submission of personal information through the Site is
                governed by our <Link href="/privacy">Privacy Policy</Link>.
              </p>
              {/* 7. Personal Information ends */}
              {/* 8. Prohibited Usage begins */}
              <div className="mb-5 mt-8 text-xl font-bold">
                8. Prohibited Usage
              </div>
              <div className="space-y-5">
                <p className="leading-7">
                  You are not allowed to use the Site for anything illegal,
                  infringing the intellectual property rights of other people,
                  harassment or otherwise abusive behaviour, spreading false
                  information or viruses, spamming, or interfering with the
                  security features of the Site.
                </p>
                <p className="leading-7">
                  You are prohibited from using the Site,
                </p>
                <ul className="list-inside list-disc space-y-2">
                  <li className="leading-7">
                    for any unlawful purpose and to solicit others to perform or
                    participate in any unlawful acts;
                  </li>
                  <li className="leading-7">
                    to violate any international, federal, provincial or state
                    regulations, rules, laws, or local ordinances;
                  </li>
                  <li className="leading-7">
                    to infringe upon or violate our intellectual property rights
                    or the intellectual property rights of others;
                  </li>
                  <li className="leading-7">
                    to harass, abuse, insult, harm, defame, slander, disparage,
                    intimidate, or discriminate based on gender, sexual
                    orientation, religion, ethnicity, race, age, national
                    origin, or disability;
                  </li>
                  <li className="leading-7">
                    to submit false or misleading information or to upload or
                    transmit viruses or any other type of malicious code that
                    will or may be used in any way that will affect the
                    functionality or operation of the Site or of any related
                    website, other websites, or the Internet;
                  </li>
                  <li className="leading-7">
                    to collect or track the personal information of others to
                    spam, phish, pretext, crawl, or scrape;
                  </li>
                  <li className="leading-7">
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
              <div className="mb-5 mt-8 text-xl font-bold">
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
              {/* 10. Refund Policy */}
              <div className="mb-5 mt-8 text-xl font-bold">
                10. Refund Policy
              </div>
              <div className="space-y-5">
                <p className="leading-7">
                  <b>No Refunds on Successful Minting:</b> We do not offer
                  refunds once profile minting is successful. All transactions
                  completed successfully are final and not subject to refunds.
                </p>
                <p className="linkify leading-7">
                  <b>Refunds for Failed Minting:</b> In the event that profile
                  minting fails, customers are eligible to request a refund. To
                  request a refund, please visit our{' '}
                  <button onClick={showCrisp}>support center</button>.
                </p>
                <p className="leading-7">
                  This policy is concise and designed to be clear and
                  straightforward, ensuring that our customers understand our
                  refund terms related to profile minting activities.
                </p>
              </div>
              {/* 10.Refund Policy */}
              {/* 11. Disclaimer of Warranties begins */}
              <div className="mb-5 mt-8 text-xl font-bold">
                11. Disclaimer of Warranties
              </div>
              <p className="leading-7">
                The Site are provided to you completely as they are, and could
                function differently than you expected. You agree to accept the
                Site as is. You expressly agree that your use of, or inability
                to use, the Site is at your sole risk. Our liability shall be
                limited entirely or to the maximum extent permitted by law.
              </p>
              {/* 11. Disclaimer of Warranties ends */}
              {/* 12. Termination and Cancellation begins */}
              <div className="mb-5 mt-8 text-xl font-bold">
                12. Termination and Cancellation
              </div>
              <div className="space-y-5">
                <p className="leading-7">
                  This Agreement is effective unless and until terminated by
                  either you or us. You may terminate the Agreement with us at
                  any time by not accessing the Site.
                </p>
                <p className="leading-7">
                  If in our sole judgment you fail to comply with terms, we
                  reserve the right to terminate our Agreement with you and deny
                  you access to the Site.
                </p>
              </div>
              {/* 12. Termination and Cancellation ends */}
              {/* 13. Contact Information begins */}
              <div className="mb-5 mt-8 text-xl font-bold">
                13. Contact Information
              </div>
              <p className="leading-7">
                Questions about the Terms should be sent to us at terms@hey.xyz
              </p>
              {/* 13. Contact Information ends */}
            </div>
          </div>
        </div>
        <div className="mb-6 mt-2 flex justify-center">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Terms;
