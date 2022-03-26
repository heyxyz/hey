const Loading: React.FC = () => {
  return (
    <div className="flex flex-grow justify-center items-center h-screen animate-pulse">
      <img className="w-28 h-28" src="/logo.svg" alt="Logo" />
    </div>
  )
}

export default Loading
