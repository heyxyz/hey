import SEO from '@components/utils/SEO'

export default function Offline() {
  return (
    <div className="flex-col page-center">
      <SEO title="Offline • Lenster" />
      <div className="py-10 text-center">
        <h1 className="text-3xl font-bold">Looks like you are offline!</h1>
      </div>
    </div>
  )
}
