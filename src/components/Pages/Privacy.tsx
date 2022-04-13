import Footer from '@components/Shared/Footer'
import SEO from '@components/utils/SEO'
import React, { FC } from 'react'

const Privacy: FC = () => {
  return (
    <>
      <SEO title="Privacy • Lenster" />
      <div className="flex items-center justify-center bg-brand-400 h-48 w-full">
        <div className="relative text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            Privacy Policy
          </h1>
          <div className="flex justify-center mt-4">
            <div className="text-xs rounded-md px-2 py-0.5 text-white bg-gray-800">
              Updated April 13, 2022
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto rounded-lg max-w-3/4 sm:w-2/4">
            <div className="!p-8 prose dark:prose-dark max-w-none text-gray-600 dark:text-gray-200">
              <p>
                Lenster.xyz. ("Lenster" or "we") respects and protects the
                privacy of Users ("you" or "users"). Lenster will collect and
                use your Personal Information, generated from your use of
                Lenster, in accordance with this Privacy Policy ("Policy").
              </p>
              <div className="text-black dark:text-white text-xl mt-8 mb-5 font-bold">
                What information do we collect
              </div>
              <p className="mb-5">
                We get information about you in a range of ways.
              </p>
              <p className="mb-5">
                Information you give us. Information we collect from you
                includes:
              </p>
              <ul className="list-disc list-inside mb-3 space-y-2">
                <li>Network information regarding transactions;</li>
                <li>Contact information, like username and email;</li>
                <li>
                  Feedback and correspondence, such as information you provide
                  in your responses to surveys, when you participate in market
                  research activities, report a problem with Service, receive
                  customer support or otherwise correspond with us;
                </li>
                <li className="linkify">
                  Usage information, such as information about how you interact
                  with us, and it is anonymous and{' '}
                  <a
                    href="https://analytics.lenster.xyz/share/DUGyxaF6/Lenster"
                    target="_blank"
                    rel="noreferrer"
                  >
                    public
                  </a>
                  ;
                </li>
              </ul>
              <div className="text-black dark:text-white text-xl mt-8 mb-5 font-bold">
                How we use the information we collect
              </div>
              <p className="mb-5">
                Our primary purpose in collecting information is to to help us
                operate, provide, improve, customize, support, and market our
                Services.
              </p>
              <ul className="list-disc list-inside mb-3 space-y-2">
                <li>Provide the Services and customer support you request;</li>
                <li>Resolve disputes and troubleshoot problems;</li>
              </ul>
              <div className="text-black dark:text-white text-xl mt-8 mb-5 font-bold">
                How we update our policy
              </div>
              <p className="mb-5">
                We reserves the right to update this Policy online from time to
                time, and the new policy will immediately replace the older one
                once posted.
              </p>
              <p className="mb-5">
                We will notify you of material changes to this policy by
                updating the last updated date at the top of this page.
              </p>
              <p className="mb-5">
                In particular, if you do not accept the revised policies, please
                immediately stop your use of Lenster.
              </p>
              <p className="mb-5">
                Your continued use of our Services confirms your acceptance of
                our Privacy Policy, as amended. If you do not agree to our
                Privacy Policy, as amended, you must stop using our Services. We
                recommend that you visit this page frequently to check for
                changes.
              </p>
              <div className="text-black dark:text-white text-xl mt-8 mb-5 font-bold">
                Contact Us
              </div>
              <p className="mb-3 linkify">
                If you have any questions about our Privacy Policy, please do
                not hesitate to contact us at{' '}
                <a href="mailto:support@lenster.xyz">support@lenster.xyz</a>.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-2 pb-6">
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Privacy
