import { Input } from '@components/UI/Input'
import { Modal } from '@components/UI/Modal'
import { Tooltip } from '@components/UI/Tooltip'
import { useDebounce } from '@components/utils/hooks/useDebounce'
import { GiphyFetch, ICategory } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { Grid } from '@giphy/react-components'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Props {
  // eslint-disable-next-line no-unused-vars
  setGifAttachment: (gif: IGif) => void
}

const giphyFetch = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

const Giphy: React.FC<Props> = ({ setGifAttachment }) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [categories, setCategories] = useState<Array<ICategory>>([])
  const [searchText, setSearchText] = useState<string>('')
  const [debouncedGifInput, setDebouncedGifInput] = useState<string>('')

  const fetchGiphyCategories = async () => {
    const { data } = await giphyFetch.categories()
    // TODO: we can persist this categories
    setCategories(data)
  }

  useEffect(() => {
    fetchGiphyCategories()
  }, [])

  useDebounce(
    () => {
      setSearchText(debouncedGifInput)
    },
    1000,
    [debouncedGifInput]
  )

  const fetchGifs = async (offset: number) => {
    return giphyFetch.search(searchText, { offset, limit: 10 })
  }

  const handleSearch = async (evt: any) => {
    let keyword = evt.target.value
    setDebouncedGifInput(keyword)
  }

  const onCloseModal = () => {
    setShowModal(!showModal)
    setSearchText('')
    setDebouncedGifInput('')
  }

  const onSelectGif = (item: IGif) => {
    setGifAttachment(item)
    setDebouncedGifInput('')
    setSearchText('')
    setShowModal(false)
  }

  return (
    <>
      <Tooltip content="GIF">
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          className="tab-focus-ring"
          onClick={() => setShowModal(!showModal)}
        >
          <div className="w-full fill-brand-500">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <g>
                <path d="M19 10.5V8.8h-4.4v6.4h1.7v-2h2v-1.7h-2v-1H19zm-7.3-1.7h1.7v6.4h-1.7V8.8zm-3.6 1.6c.4 0 .9.2 1.2.5l1.2-1C9.9 9.2 9 8.8 8.1 8.8c-1.8 0-3.2 1.4-3.2 3.2s1.4 3.2 3.2 3.2c1 0 1.8-.4 2.4-1.1v-2.5H7.7v1.2h1.2v.6c-.2.1-.5.2-.8.2-.9 0-1.6-.7-1.6-1.6 0-.8.7-1.6 1.6-1.6z"></path>
                <path d="M20.5 2.02h-17c-1.24 0-2.25 1.007-2.25 2.247v15.507c0 1.238 1.01 2.246 2.25 2.246h17c1.24 0 2.25-1.008 2.25-2.246V4.267c0-1.24-1.01-2.247-2.25-2.247zm.75 17.754c0 .41-.336.746-.75.746h-17c-.414 0-.75-.336-.75-.746V4.267c0-.412.336-.747.75-.747h17c.414 0 .75.335.75.747v15.507z"></path>
              </g>
            </svg>
          </div>
        </motion.button>
      </Tooltip>
      <Modal onClose={() => onCloseModal()} title="Select GIF" show={showModal}>
        <Input
          className="m-3"
          type="text"
          placeholder="Search for GIFs"
          value={debouncedGifInput}
          onChange={handleSearch}
        />
        <div className="flex overflow-y-auto overflow-x-hidden mb-1 h-96">
          {debouncedGifInput ? (
            <Grid
              onGifClick={(item) => onSelectGif(item)}
              fetchGifs={fetchGifs}
              width={498}
              hideAttribution
              columns={3}
              noResultsMessage={
                <div className="grid place-items-center h-full">
                  No GIFs found.
                </div>
              }
              noLink
              key={searchText}
            />
          ) : (
            <div className="grid grid-cols-2 gap-1 w-full">
              {categories.map((category, idx) => (
                <button
                  key={idx}
                  className="flex relative outline-none"
                  onClick={() => setDebouncedGifInput(category.name)}
                >
                  <img
                    className="object-cover w-full h-32 cursor-pointer"
                    src={category.gif?.images?.original_still.url}
                    alt=""
                    draggable={false}
                  />
                  <div className="absolute right-0 bottom-0 py-1 px-2 w-full text-lg font-bold text-right text-white bg-gradient-to-b from-transparent to-gray-800">
                    <span className="capitalize">{category.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

export default Giphy
