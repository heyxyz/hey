import type { FC } from 'react';

interface AuthMessageProps {
  description: string;
  title: string;
}

const AuthMessage: FC<AuthMessageProps> = ({ description, title }) => (
  <div className="space-y-2">
    <div className="text-xl font-bold">{title}</div>
    <div className="ld-text-gray-500 text-sm">{description}</div>
  </div>
);

export default AuthMessage;
