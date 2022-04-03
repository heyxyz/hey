const NotificationShimmer: React.FC = () => {
  return (
    <div className="px-4 py-6">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full shimmer" />
        <div className="w-5/6 space-y-2">
          <div className="h-3 w-2/3 rounded-lg shimmer" />
          <div className="h-2 w-5/6 rounded-lg shimmer" />
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 rounded-lg shimmer" />
            <div className="h-2 w-20 rounded-lg shimmer" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationShimmer
