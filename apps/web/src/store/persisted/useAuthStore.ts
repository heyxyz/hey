import { Localstorage } from "@hey/data/storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Tokens {
  accessToken: null | string;
  idToken: null | string;
  refreshToken: null | string;
}

interface State {
  accessToken: Tokens["accessToken"];
  hydrateAuthTokens: () => Tokens;
  idToken: Tokens["idToken"];
  refreshToken: Tokens["refreshToken"];
  signIn: (tokens: {
    accessToken: string;
    idToken: string;
    refreshToken: string;
  }) => void;
  signOut: () => void;
}

const store = create(
  persist<State>(
    (set, get) => ({
      accessToken: null,
      hydrateAuthTokens: () => {
        const { accessToken, idToken, refreshToken } = get();
        return { accessToken, idToken, refreshToken };
      },
      idToken: null,
      refreshToken: null,
      signIn: ({ accessToken, idToken, refreshToken }) =>
        set({ accessToken, idToken, refreshToken }),
      signOut: async () => {
        // Clear Localstorage
        const allLocalstorageStores = Object.values(Localstorage).filter(
          (value) =>
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
  idToken: string;
  refreshToken: string;
}) => store.getState().signIn(tokens);
export const signOut = () => store.getState().signOut();
export const hydrateAuthTokens = () => store.getState().hydrateAuthTokens();
