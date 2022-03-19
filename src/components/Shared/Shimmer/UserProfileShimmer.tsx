interface Props {
  showFollow?: boolean
}

const UserProfileShimmer: React.FC<Props> = ({ showFollow = false }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="rounded-full w-11 h-11 shimmer" />
        <div className="space-y-3">
          <div className="h-3 rounded-lg w-28 shimmer" />
          <div className="w-20 h-3 rounded-lg shimmer" />
        </div>
      </div>
      {showFollow && <div className="w-10 h-8 rounded-lg shimmer" />}
    </div>
  )
}

export default UserProfileShimmer
