const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center flex-grow h-screen animate-pulse">
      <img className="h-28 w-28" src="/logo.svg" alt="Logo" />
    </div>
  )
}

export default Loading
