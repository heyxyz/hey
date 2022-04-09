import AppContext from '@components/utils/AppContext'
import Link from 'next/link'
import { useContext } from 'react'
import {
  GITLAB_URL,
  OPEN_ANAYTICS_PAGE_URL,
  STATUS_PAGE_URL,
  VERCEL_REF_URL
} from 'src/constants'

const Footer: React.FC = () => {
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
        <Link href="/terms" passHref>
          Terms
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
        href={STATUS_PAGE_URL}
        target="_blank"
        rel="noreferrer"
      >
        Status
      </a>
      <a
        className="pr-3"
        href={OPEN_ANAYTICS_PAGE_URL}
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
      <a className="pr-3" href={GITLAB_URL} target="_blank" rel="noreferrer">
        GitLab
      </a>
      <a
        className="pr-3 hover:font-bold"
        href={VERCEL_REF_URL}
        target="_blank"
        rel="noreferrer"
      >
        ▲ Powered by Vercel
      </a>
    </footer>
  )
}

export default Footer
