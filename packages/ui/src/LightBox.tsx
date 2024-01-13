import type { FC } from 'react';

import stopEventPropagation from '@hey/lib/stopEventPropagation';
import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';

interface LightBoxProps {
  onClose: () => void;
  show: boolean;
  url: null | string;
}

export const LightBox: FC<LightBoxProps> = ({ onClose, show, url }) => {
  return (
    <Dialog.Root onOpenChange={(open) => !open && onClose?.()} open={show}>
      <Dialog.Portal>
        <div className="fixed inset-0 z-10 overflow-y-auto text-center">
          <Dialog.Overlay className="fixed inset-0 bg-gray-500/75 transition-opacity" />
          <Dialog.Content className="radix-transition">
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" />
            <div className="inline-block p-8 text-left align-middle transition-all sm:max-w-3xl">
              <img
                alt={url || ''}
                className="max-h-screen"
                height={1000}
                onClick={onClose}
                src={url || ''}
                width={1000}
              />
              {url ? (
                <div className="mt-1">
                  <Link
                    className="text-sm text-gray-200 hover:underline"
                    href={url}
                    onClick={stopEventPropagation}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Open original
                  </Link>
                </div>
              ) : null}
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
