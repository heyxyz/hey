import { useLazyQuery } from '@apollo/client';
import Slug from '@components/Shared/Slug';
import { UserSuggestion } from '@generated/lenstertypes';
import { MediaSet, NftImage, Profile, SearchProfilesDocument, SearchRequestTypes } from '@generated/types';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import getIPFSLink from '@lib/getIPFSLink';
import getStampFyiURL from '@lib/getStampFyiURL';
import imagekitURL from '@lib/imagekitURL';
import isVerified from '@lib/isVerified';
import clsx from 'clsx';
import { Dispatch, FC } from 'react';
import { Mention, MentionsInput } from 'react-mentions';
import { usePublicationStore } from 'src/store/publication';

interface UserProps {
  suggestion: UserSuggestion;
  focused: boolean;
}

const User: FC<UserProps> = ({ suggestion, focused }) => (
  <div
    className={clsx({ 'dropdown-active': focused }, 'flex items-center space-x-2 m-1.5 px-3 py-1 rounded-xl')}
  >
    <img
      className="w-7 h-7 rounded-full"
      height={32}
      width={32}
      src={imagekitURL(getIPFSLink(suggestion.picture), 'avatar')}
      alt={suggestion.id}
    />
    <div className="flex flex-col truncate">
      <div className="flex gap-1 items-center">
        <div className="text-sm truncate">{suggestion.name}</div>
        {isVerified(suggestion.uid) && <BadgeCheckIcon className="w-3 h-3 text-brand" />}
      </div>
      <Slug className="text-xs" slug={suggestion.id} prefix="@" />
    </div>
  </div>
);

interface Props {
  error: string;
  setError: Dispatch<string>;
  placeholder?: string;
}

export const MentionTextArea: FC<Props> = ({ error, setError, placeholder = '' }) => {
  const publicationContent = usePublicationStore((state) => state.publicationContent);
  const setPublicationContent = usePublicationStore((state) => state.setPublicationContent);
  const [searchUsers] = useLazyQuery(SearchProfilesDocument);

  const fetchUsers = (query: string, callback: any) => {
    if (!query) {
      return;
    }

    searchUsers({
      variables: { request: { type: SearchRequestTypes.Profile, query, limit: 5 } }
    })
      .then(({ data }) => {
        // @ts-ignore
        const profiles = data?.search?.items ?? [];
        return profiles.map((user: Profile & { picture: MediaSet & NftImage }) => ({
          uid: user.id,
          id: user.handle,
          display: user.handle,
          name: user?.name ?? user?.handle,
          picture: user?.picture?.original?.url ?? user?.picture?.uri ?? getStampFyiURL(user?.ownedBy)
        }));
      })
      .then(callback);
  };

  return (
    <div className="mb-2">
      <MentionsInput
        className="mention-input"
        value={publicationContent}
        placeholder={placeholder}
        onChange={(e) => {
          setPublicationContent(e.target.value);
          setError('');
        }}
      >
        <Mention
          trigger="@"
          displayTransform={(login) => `@${login} `}
          markup="@__id__ "
          renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
            <User suggestion={suggestion as UserSuggestion} focused={focused} />
          )}
          data={fetchUsers}
        />
      </MentionsInput>
      {error && <div className="mt-1 text-sm font-bold text-red-500">{error}</div>}
    </div>
  );
};
