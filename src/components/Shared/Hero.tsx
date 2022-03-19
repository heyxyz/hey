import { STATIC_ASSETS } from 'src/constants'

const Hero: React.FC = () => {
  return (
    <div
      className="hidden col-span-12 lg:col-span-7 md:col-span-12 bg-brand-600 dark:bg-brand-700 md:block"
      style={{
        backgroundImage: `url('${STATIC_ASSETS}/patterns/2.svg')`
      }}
    />
  )
}

export default Hero
