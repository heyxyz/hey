import * as React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

type Props = {
  children: JSX.Element;
  onError: (error: Error) => void;
};

export default function ErrorBoundary({ children, onError }: Props): JSX.Element {
  return (
    <ReactErrorBoundary
      fallback={
        <span className="ErrorBoundary__container">
          React crashed. Please,
          <a href="https://github.com/lensterxyz/lenster/issues/new/">file a task</a>.
        </span>
      }
      onError={onError}
    >
      {children}
    </ReactErrorBoundary>
  );
}
