import AppContext from '@components/utils/AppContext'
import Link from 'next/link'
import { FC, useContext } from 'react'

const Footer: FC = () => {
  const { staffMode } = useContext(AppContext)

  return (
    <footer
      className={`mt-4 leading-7 text-sm sticky flex flex-wrap px-3 lg:px-0 ${
        staffMode ? 'top-28' : 'top-20'
      }`}
    >
      <span className="pr-3 font-bold text-gray-500 dark:text-gray-300">
        © Lenster
      </span>
      <span className="pr-3">
        <Link href="/about" passHref>
          About
        </Link>
      </span>
      <span className="pr-3">
        <Link href="/privacy" passHref>
          Privacy
        </Link>
      </span>
      <span className="pr-3">
        <Link href="/discord">Discord</Link>
      </span>
      <a
        className="pr-3"
        href="https://status.lenster.xyz"
        target="_blank"
        rel="noreferrer"
      >
        Status
      </a>
      <a
        className="pr-3"
        href="https://analytics.lenster.xyz/share/DUGyxaF6/Lenster"
        target="_blank"
        rel="noreferrer"
      >
        Open
      </a>
      <span className="pr-3">
        <Link href="/thanks" passHref>
          Thanks
        </Link>
      </span>
      <a
        className="pr-3"
        href="https://gitlab.com/lenster/lenster"
        target="_blank"
        rel="noreferrer"
      >
        GitLab
      </a>
      <a
        className="pr-3 hover:font-bold"
        href="https://vercel.com/?utm_source=Lenster&utm_campaign=oss"
        target="_blank"
        rel="noreferrer"
      >
        ▲ Powered by Vercel
      </a>
    </footer>
  )
}

export default Footer
