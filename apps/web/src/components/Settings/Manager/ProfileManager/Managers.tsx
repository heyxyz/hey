import Loader from '@components/Shared/Loader';
import WalletProfile from '@components/Shared/WalletProfile';
import { useProfileManagersQuery } from '@hey/lens';
import { ErrorMessage } from '@hey/ui';
import { type FC } from 'react';
import { useAppStore } from 'src/store/useAppStore';

const Managers: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const people = [
    {
      name: 'Lindsay Walton',
      title: 'Front-end Developer',
      department: 'Optimization',
      email: 'lindsay.walton@example.com',
      role: 'Member',
      image:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
    // More people...
  ];

  const { data, loading, error } = useProfileManagersQuery({
    variables: { request: { for: currentProfile?.id } }
  });

  return (
    <div className="space-y-3 pt-2">
      {loading ? (
        <div className="py-5">
          <Loader />
        </div>
      ) : error ? (
        <ErrorMessage className="m-5" error={error} />
      ) : (
        <div>
          <div>
            Accounts with control over your profile can act on your behalf.
          </div>
          <div className="divider my-5" />
          {data?.profileManagers.items.map((manager) => (
            <div key={manager.address}>
              <WalletProfile address={manager.address} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Managers;
