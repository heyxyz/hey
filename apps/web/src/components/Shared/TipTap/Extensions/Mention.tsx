import type {
  Profile,
  SearchProfilesQuery,
  SearchProfilesQueryVariables
} from '@hey/lens';
import type { NodeViewRendererProps } from '@tiptap/react';
import type { SuggestionProps } from '@tiptap/suggestion';

import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import {
  CustomFiltersType,
  LimitType,
  SearchProfilesDocument
} from '@hey/lens';
import { apolloClient } from '@hey/lens/apollo';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import hasMisused from '@hey/lib/hasMisused';
import isVerified from '@lib/isVerified';
import { PluginKey } from '@tiptap/pm/state';
import {
  mergeAttributes,
  NodeViewWrapper,
  ReactNodeViewRenderer
} from '@tiptap/react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import type { NodeSuggestionOptions } from './Shared/Suggestion';

import makeSuggestionRender from './Shared/RenderSuggestionList';
import createSuggestion from './Shared/Suggestion';

interface SearchProfile {
  displayHandle: string;
  handle: string;
  id: string;
  name: string;
  picture: string;
}

const MentionList = forwardRef((props: SuggestionProps<SearchProfile>, ref) => {
  const { command, items: users } = props;

  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => setSelectedIndex(0), [users]);

  const submitUser = (index: number) => {
    const user = users[index];

    if (user) {
      command({
        id: user.id,
        label: user.handle
      } as any);
    }
  };

  const onUp = () =>
    setSelectedIndex((i) => (i + users.length - 1) % users.length);
  const onDown = () => setSelectedIndex((i) => (i + 1) % users.length);
  const onEnter = () => submitUser(selectedIndex);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        onUp();
        return true;
      }
      if (event.key === 'ArrowDown') {
        onDown();
        return true;
      }
      if (event.key === 'Enter') {
        onEnter();
        return true;
      }
      return false;
    }
  }));

  if (users.length < 0) {
    return;
  }

  return (
    <div>
      {users.length > 0 ? (
        <div className="bg-brand sticky z-40  w-52 min-w-full rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <ul className="divide-y dark:divide-gray-700">
            {users.map((user, index) => (
              <li className="cursor-pointer" key={user.id} tabIndex={-1}>
                <div
                  className={`m-1.5 flex items-center space-x-2 rounded-xl px-3 py-1 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-800 ${
                    selectedIndex === index
                      ? 'bg-gray-200 dark:bg-gray-800'
                      : ''
                  }`}
                  key={user.id}
                  onClick={() => submitUser(index)}
                >
                  <img
                    alt={user.displayHandle}
                    className="size-7 rounded-full"
                    height="32"
                    src={user.picture}
                    width="32"
                  />
                  <div className="flex flex-col truncate">
                    <div className="flex items-center space-x-1 text-sm">
                      <span>{user.name}</span>
                      {isVerified(user.id) ? (
                        <CheckBadgeIcon className="text-brand-500 size-4" />
                      ) : null}
                      {hasMisused(user.id) ? (
                        <ExclamationCircleIcon className="size-4 text-red-500" />
                      ) : null}
                    </div>
                    <span className="text-xs">{user.displayHandle}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
});

MentionList.displayName = 'MentionList';

type Suggestion = NodeSuggestionOptions['suggestion'];

export const mentionSuggestion: Suggestion = {
  allowedPrefixes: [' '],
  items: async ({ query }) => {
    if (query.length < 1) {
      return [];
    }
    const { data } = await apolloClient().query<
      SearchProfilesQuery,
      SearchProfilesQueryVariables
    >({
      query: SearchProfilesDocument,
      variables: {
        request: {
          limit: LimitType.Ten,
          query: query,
          where: { customFilters: [CustomFiltersType.Gardeners] }
        }
      }
    });

    const items = (data.searchProfiles.items as Profile[]).map((user) => {
      return {
        displayHandle: getProfile(user).slugWithPrefix,
        handle: user.handle?.fullHandle,
        id: user?.id,
        name: getProfile(user).displayName,
        picture: getAvatar(user)
      };
    });
    return items;
  },

  render: makeSuggestionRender(MentionList)
};

const name = 'mention-component';

const MentionComponent = (props: NodeViewRendererProps) => {
  return (
    <NodeViewWrapper className={name}>
      <p className="text-brand-500">@{props.node.attrs.label}</p>
    </NodeViewWrapper>
  );
};

const Mention = createSuggestion({
  pluginKey: new PluginKey('mention'),
  pluginName: 'mention',
  suggestionPrefix: '@'
});

export const DisplayMention = Mention.extend({
  addNodeView: () =>
    ReactNodeViewRenderer(MentionComponent, { className: 'inline-block' }),
  parseHTML: () => [{ tag: name }],
  renderHTML: ({ HTMLAttributes }) => [name, mergeAttributes(HTMLAttributes)]
}).configure({ suggestion: mentionSuggestion });
