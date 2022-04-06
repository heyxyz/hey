const NewPostShimmer: React.FC = () => {
  return (
    <div className="pt-5 px-5 pb-3 space-y-3">
      <div className="shimmer h-16 rounded-xl" />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-5 w-5 rounded-lg shimmer" />
          <div className="h-5 w-5 rounded-lg shimmer" />
          <div className="h-5 w-5 rounded-lg shimmer" />
          <div className="h-5 w-5 rounded-lg shimmer" />
        </div>
        <div className="h-[35px] w-20 shimmer rounded-lg" />
      </div>
    </div>
  )
}

export default NewPostShimmer
