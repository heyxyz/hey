import { signOut } from "@/store/auth";
import { LENS_API_URL } from "@hey/data/constants";

const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`;

export const refreshAuthTokens = async (refreshToken: string) => {
  try {
    const response = await fetch(LENS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationName: "Refresh",
        query: REFRESH_AUTHENTICATION_MUTATION,
        variables: { request: { refreshToken } }
      })
    });
    return (await response.json()).data.refresh as {
      accessToken: string;
      refreshToken: string;
    };
  } catch {
    await signOut();
    return null;
  }
};
