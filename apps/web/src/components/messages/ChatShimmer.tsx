export const ChatItemShimmer = () => {
  return (
    <div className="mx-auto w-full max-w-sm py-4">
      <div className="flex animate-pulse space-x-4">
        <div className="h-10 w-10 rounded-full bg-gray-300" />
        <div className="flex-1 space-y-4 py-1">
          <div className="h-2 w-1/2 rounded bg-gray-300" />
          <div className="h-2 rounded bg-gray-300" />
        </div>
      </div>
    </div>
  );
};

export const ChatShimmer = () => {
  return (
    <div className="max-h-[-webkit-calc(100vh-65px)] overflow-hidden">
      {Array.from(Array(30).keys()).map((each) => (
        <ChatItemShimmer key={each} />
      ))}
    </div>
  );
};
