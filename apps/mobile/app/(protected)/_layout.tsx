import { AuthScreen } from "@/components/auth/screen";
import { useAuthStore } from "@/store/auth";
import { useActiveProfile } from "@/store/profile";
import { type Profile, useCurrentProfileQuery } from "@hey/lens";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";

const RootLayout = () => {
  const id = useAuthStore((state) => state.session.id);
  // const hydrated = useAuthStore((state) => state.hydrated);
  const setActiveProfile = useActiveProfile((state) => state.setProfile);

  const { data } = useCurrentProfileQuery({
    variables: {
      request: { forProfileId: id }
    }
  });

  useEffect(() => {
    if (data?.profile) {
      setActiveProfile(data.profile as Profile);
    }
  }, [data]);

  // if (!hydrated) {
  //   return null;
  // }

  if (!id) {
    return <AuthScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(feed)" />
      <Stack.Screen
        name="create"
        options={{ presentation: "fullScreenModal" }}
      />
    </Stack>
  );
};

export default RootLayout;
