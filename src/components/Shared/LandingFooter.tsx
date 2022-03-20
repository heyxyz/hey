import Link from 'next/link'

const LandingFooter: React.FC = () => {
  return (
    <>
      <footer className="flex-wrap hidden mt-5 leading-7 md:flex">
        <span className="pr-3 font-bold text-gray-500 dark:text-gray-300">
          © LensHub
        </span>
        <span className="pr-3">
          <Link href="/about" passHref>
            About
          </Link>
        </span>
        <span className="pr-3">
          <Link href="/terms" passHref>
            Terms
          </Link>
        </span>
        <span className="pr-3">
          <Link href="/privacy" passHref>
            Privacy
          </Link>
        </span>
        <a
          href="https://gitlab.com/lenshub/lenshub"
          target="_blank"
          rel="noreferrer"
        >
          Status
        </a>
      </footer>
      <a
        className="hidden mt-2 hover:font-bold md:block"
        href="https://vercel.com/?utm_source=LensHub&utm_campaign=oss"
        target="_blank"
        rel="noreferrer"
      >
        ▲ Powered by Vercel
      </a>
    </>
  )
}

export default LandingFooter
