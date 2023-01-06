import type { FC } from 'react';

const Typography: FC = () => {
  return (
    <div className="space-y-3">
      <div className="text-xl font-bold">Typography</div>
      <div className="space-y-2">
        <div>
          <span className="font-bold">text-4xl - </span>
          <span className="text-4xl">The quick brown fox jumps over the lazy dog</span>
        </div>
        <div>
          <span className="font-bold">text-3xl - </span>
          <span className="text-3xl">The quick brown fox jumps over the lazy dog</span>
        </div>
        <div>
          <span className="font-bold">text-2xl - </span>
          <span className="text-2xl">The quick brown fox jumps over the lazy dog</span>
        </div>
        <div>
          <span className="font-bold">text-xl - </span>
          <span className="text-xl">The quick brown fox jumps over the lazy dog</span>
        </div>
        <div>
          <span className="font-bold">text-lg - </span>
          <span className="text-lg">The quick brown fox jumps over the lazy dog</span>
        </div>
        <div>
          <span className="font-bold">text-md - </span>
          <span className="text-md">The quick brown fox jumps over the lazy dog</span>
        </div>
        <div>
          <span className="font-bold">text-sm - </span>
          <span className="text-sm">The quick brown fox jumps over the lazy dog</span>
        </div>
        <div>
          <span className="font-bold">text-xs - </span>
          <span className="text-xs">The quick brown fox jumps over the lazy dog</span>
        </div>
        <div>
          <span className="font-bold">font-bold - </span>
          <span className="font-bold">The quick brown fox jumps over the lazy dog</span>
        </div>
        <div>
          <span className="font-bold">italic - </span>
          <span className="italic">The quick brown fox jumps over the lazy dog</span>
        </div>
        <div>
          <span className="font-bold">font-mono - </span>
          <span className="font-mono">The quick brown fox jumps over the lazy dog</span>
        </div>
        <div>
          <span className="font-bold">font-serif - </span>
          <span className="font-serif">The quick brown fox jumps over the lazy dog</span>
        </div>
      </div>
    </div>
  );
};

export default Typography;
