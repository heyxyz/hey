const NotificationShimmer: React.FC = () => {
  return (
    <div className="py-6 px-4 flex items-center space-x-4">
      <div className="w-10 h-10 rounded-full shimmer" />
      <div className="space-y-2 w-5/6">
        <div className="w-2/3 h-3 rounded-lg shimmer" />
        <div className="w-5/6 h-2 rounded-lg shimmer" />
        <div className="flex items-center pt-1 space-x-1">
          <div className="w-3 h-3 rounded-lg shimmer" />
          <div className="w-20 h-2 rounded-lg shimmer" />
        </div>
      </div>
    </div>
  )
}

export default NotificationShimmer
