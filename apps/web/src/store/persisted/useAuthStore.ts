import { Localstorage } from "@hey/data/storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Tokens {
  accessToken: null | string;
  identityToken: null | string;
  refreshToken: null | string;
}

interface State {
  accessToken: Tokens["accessToken"];
  hydrateAuthTokens: () => Tokens;
  identityToken: Tokens["identityToken"];
  refreshToken: Tokens["refreshToken"];
  signIn: (tokens: {
    accessToken: string;
    identityToken: string;
    refreshToken: string;
  }) => void;
  signOut: () => void;
}

const store = create(
  persist<State>(
    (set, get) => ({
      accessToken: null,
      hydrateAuthTokens: () => {
        return {
          accessToken: get().accessToken,
          identityToken: get().identityToken,
          refreshToken: get().refreshToken
        };
      },
      identityToken: null,
      refreshToken: null,
      signIn: ({ accessToken, identityToken, refreshToken }) =>
        set({ accessToken, identityToken, refreshToken }),
      signOut: async () => {
        // Clear Localstorage
        const allLocalstorageStores = Object.values(Localstorage).filter(
          (value) =>
            value !== Localstorage.LeafwatchStore &&
            value !== Localstorage.VerifiedMembersStore &&
            value !== Localstorage.SearchStore
        );
        for (const store of allLocalstorageStores) {
          localStorage.removeItem(store);
        }
      }
    }),
    { name: Localstorage.AuthStore }
  )
);

export const signIn = (tokens: {
  accessToken: string;
  identityToken: string;
  refreshToken: string;
}) => store.getState().signIn(tokens);
export const signOut = () => store.getState().signOut();
export const hydrateAuthTokens = () => store.getState().hydrateAuthTokens();
