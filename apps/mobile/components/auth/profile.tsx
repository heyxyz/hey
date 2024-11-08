import normalizeFont from "@/helpers/normalize-font";
import getAvatar from "@hey/helpers/getAvatar";
import getProfile from "@hey/helpers/getProfile";
import type { Profile } from "@hey/lens";
import { Image } from "expo-image";
import { Text, View } from "react-native";

export const ProfileView = ({ profile }: { profile: Profile }) => {
  return (
    <View style={{ alignItems: "center", gap: 10 }}>
      <Image
        source={{ uri: getAvatar(profile) }}
        style={{ width: 50, borderRadius: 100, height: 50 }}
      />
      <Text style={{ fontFamily: "Sans", fontSize: normalizeFont(16) }}>
        {getProfile(profile).slugWithPrefix}
      </Text>
    </View>
  );
};
