import MetaTags from '@components/Common/MetaTags';
import Footer from '@components/Shared/Footer';
import { t } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import type { FC } from 'react';

const Privacy: FC = () => {
  return (
    <>
      <MetaTags title={t`Privacy Policy • ${APP_NAME}`} />
      <div className="flex justify-center items-center w-full h-48 bg-brand-400">
        <div className="relative text-center">
          <h1 className="text-3xl font-bold text-white md:text-4xl">Privacy Policy</h1>
          <div className="flex justify-center mt-4">
            <div className="py-0.5 px-2 text-xs text-white bg-gray-800 rounded-md">
              Updated December 11, 2022
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto rounded-lg sm:w-2/4 max-w-3/4">
            <div className="!p-8 max-w-none lt-text-gray-500">
              {/* 1. Overview beings */}
              <div className="mb-5 text-xl font-bold text-black dark:text-white">1. Overview</div>
              <div className="space-y-5 leading-7">
                <p>
                  By accessing the Site, you agree to not only this Privacy Policy, but also to our Terms of
                  Use and any other written agreements for using the Site. And you agree to our collection and
                  use of any personal data (as described here) as well as the features of
                  public/permissionless blockchain technology.
                </p>
                <p>
                  This Privacy Policy (the “Privacy Policy”) provides a comprehensive description of how
                  Lenster (“we,” “our,” or “us”) collects, uses, and shares information about you in
                  connection with the website at lenster.xyz”, as well as your rights and choices regarding
                  such information.
                </p>
                <p>
                  By accessing or using the Site, you accept and assume certain inherent features related to
                  engaging in recording the data on the blockchain. Interactions with the Lens Protocol rely
                  on smart contracts stored on a publicly available blockchain, cryptographic tokens generated
                  by the smart contracts, and other nascent software, applications and systems that interact
                  with blockchain-based networks. One of the defining features of blockchain technology is
                  that its entries are immutable, which means, as a technical matter, they generally cannot be
                  deleted or modified by anyone. If you are not comfortable assuming the inherently immutable
                  and public nature of all entries on the blockchain, you should not engage with our Site.
                </p>
              </div>
              {/* 1. Overview ends */}
              {/* 2. Information Collection beings */}
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white">
                2. Information Collection
              </div>
              <div className="space-y-5 leading-7">
                <p>We may collect the following information about you when you use the Site:</p>
                <ul className="list-disc list-inside">
                  <li>Information you provide such as feedback, question and issues reports.</li>
                </ul>
                <p>
                  You may choose to voluntarily provide other information to us that we have not solicited
                  from you, and, in such instances, you are solely responsible for such information.
                </p>
                <p>
                  We may use tracking technologies to automatically collect information including the
                  following:
                </p>
                <ul className="space-y-3 list-disc list-inside">
                  <li>
                    <b>Log Files</b>, to record events or errors that occur when using our Site.
                  </li>
                  <li>
                    <b>Cookies</b>, small data stored on your device that are necessary for you to browse the
                    Site.
                  </li>
                  <li>
                    <b>Public Information</b>, data from activity that is publicly visible and/or accessible
                    on blockchains. This may include blockchain addresses and information regarding the NFTs
                    in wallets.
                  </li>
                </ul>
              </div>
              {/* 2. Information Collection ends */}
              {/* 3. Use of Information begins */}
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white">
                3. Use of Information
              </div>
              <p className="leading-7">
                We may need to use it to operate and manage the Services on this Site (or other places),
                provide you support, ensure we comply with laws and regulation, and enforce the security of
                the Site or make other improvements.
              </p>
              {/* 3. Use of Information ends */}
              {/* 4. Third-Parties begins */}
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white">4. Third-Parties</div>
              <p className="leading-7">
                This Privacy Policy does not apply to websites, apps, products, or services that we do not own
                or control. For example, your interactions with Ethereum wallet are governed by the applicable
                privacy policies of that particular wallet.
              </p>
              {/* 4. Third-Parties ends */}
              {/* 5. Analytics begins */}
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white">5. Analytics</div>
              <div className="space-y-5 leading-7">
                <p>
                  We use <b>Simple Analytics</b> to collect various events from user actions to analyse and
                  make decisions for Site improvements.
                </p>
                <p>
                  All the data are anonymous and we don’t track user details such as name, handle, email,
                  wallet address and so on.
                </p>
                <p>
                  We may change to other third-party analytics service provider. The Privacy Policy of
                  Analytics subjects to the every provider. You should review everything before using the
                  Site.
                </p>
              </div>
              {/* 5. Analytics ends */}
              {/* 6. Your Rights and Choices begins */}
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white">
                6. Your Rights and Choices
              </div>
              <div className="space-y-5 leading-7">
                <p>We may collect the following information about you when you use the Site:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    <b>Cookies</b>. We will only use strictly necessary cookies. These cookies are essential
                    for you to browse the Site and use its features, including accessing secure areas of the
                    Site.
                  </li>
                  <li className="linkify">
                    <b>Do Not Track</b>. Your browser settings may allow you to automatically transmit a “Do
                    Not Track” signal to the online services you visit. Note, however, there is no industry
                    consensus as to what Site and app operators should do with regard to these signals.
                    Accordingly, unless and until the law is interpreted to require us to do so, we do not
                    monitor or take action with respect to “Do Not Track” signals. For more information on “Do
                    Not Track,” visit{' '}
                    <a href="https://allaboutdnt.com" target="_blank" rel="noreferrer">
                      https://allaboutdnt.com
                    </a>
                    .
                  </li>
                </ul>
              </div>
              {/* 6. Your Rights and Choices ends */}
              {/* 7. Data Security begins */}
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white">7. Data Security</div>
              <p className="leading-7">
                We implement and maintain reasonable administrative, physical, and technical security
                safeguards to help protect information about you from loss, theft, misuse, unauthorised
                access, disclosure, alteration, and destruction. Nevertheless, transmission via the internet
                is not completely secure and we cannot guarantee the security of information about you.
              </p>
              {/* 7. Data Security ends */}
              {/* 8. Children begins */}
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white">8. Children</div>
              <p className="leading-7">
                The Site is intended for general audiences and are not directed at children. To use the Site,
                you must legally be able to enter into the Agreement. We do not knowingly collect personal
                information from children.
              </p>
              {/* 8. Children ends */}
              {/* 9. Changes to Policy begins */}
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white">
                9. Changes to Policy
              </div>
              <p className="leading-7">
                We reserve the right to revise and reissue this Privacy Policy at any time. Any changes will
                be effective immediately upon our posting of the revised Privacy Policy. For the avoidance of
                doubt, your continued use of the Site indicates your consent to the revised Privacy Policy
                then posted.
              </p>
              {/* 9. Changes to Policy ends */}
              {/* 10. Contact begins */}
              <div className="mt-8 mb-5 text-xl font-bold text-black dark:text-white">10. Contact</div>
              <p className="leading-7">
                If you have any questions or comments about this Privacy Policy, our data practices, or our
                compliance with applicable law, please contact us at privacy@lenster.xyz
              </p>
              {/* 10. Contact ends */}
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-2 pb-6">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Privacy;
