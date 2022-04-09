import { Input } from '@components/UI/Input'
import { useDebounce } from '@components/utils/hooks/useDebounce'
import { GiphyFetch, ICategory } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { Grid } from '@giphy/react-components'
import { Dispatch, FC, useEffect, useState } from 'react'

interface Props {
  // eslint-disable-next-line no-unused-vars
  setGifAttachment: (gif: IGif) => void
  setShowModal: Dispatch<boolean>
}

const giphyFetch = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh')

const GifSelector: FC<Props> = ({ setShowModal, setGifAttachment }) => {
  const [categories, setCategories] = useState<Array<ICategory>>([])
  const [debouncedGifInput, setDebouncedGifInput] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')

  const fetchGiphyCategories = async () => {
    const { data } = await giphyFetch.categories()
    // TODO: we can persist this categories
    setCategories(data)
  }

  const onSelectGif = (item: IGif) => {
    setGifAttachment(item)
    setDebouncedGifInput('')
    setSearchText('')
    setShowModal(false)
  }

  useDebounce(
    () => {
      setSearchText(debouncedGifInput)
    },
    1000,
    [debouncedGifInput]
  )

  useEffect(() => {
    fetchGiphyCategories()
  }, [])

  const fetchGifs = async (offset: number) => {
    return giphyFetch.search(searchText, { offset, limit: 10 })
  }

  const handleSearch = async (evt: any) => {
    let keyword = evt.target.value
    setDebouncedGifInput(keyword)
  }

  return (
    <div>
      <Input
        className="m-3"
        type="text"
        placeholder="Search for GIFs"
        value={debouncedGifInput}
        onChange={handleSearch}
      />
      <div className="flex overflow-y-auto overflow-x-hidden h-[45vh]">
        {debouncedGifInput ? (
          <Grid
            onGifClick={(item) => onSelectGif(item)}
            fetchGifs={fetchGifs}
            width={498}
            hideAttribution
            columns={3}
            noResultsMessage={
              <div className="grid h-full place-items-center">
                No GIFs found.
              </div>
            }
            noLink
            key={searchText}
          />
        ) : (
          <div className="grid w-full grid-cols-2 gap-1">
            {categories.map((category, idx) => (
              <button
                key={idx}
                className="relative flex outline-none"
                onClick={() => setDebouncedGifInput(category.name)}
              >
                <img
                  className="object-cover w-full h-32 cursor-pointer"
                  src={category.gif?.images?.original_still.url}
                  alt=""
                  draggable={false}
                />
                <div className="absolute bottom-0 right-0 w-full px-2 py-1 text-lg font-bold text-right text-white bg-gradient-to-b from-transparent to-gray-800">
                  <span className="capitalize">{category.name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GifSelector
