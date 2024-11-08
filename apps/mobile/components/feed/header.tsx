import { haptic } from "@/helpers/haptics";
import normalizeFont from "@/helpers/normalize-font";
import { useAuthStore } from "@/store/auth";
import { useActiveProfile } from "@/store/profile";
import getAvatar from "@hey/helpers/getAvatar";
import { Image } from "expo-image";
import { useMemo, useState } from "react";
import {
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatedButton } from "../ui/animated-button";

const TAB_LABELS = ["For You", "Discover"];

export const Header = () => {
  const { top } = useSafeAreaInsets();
  const signOut = useAuthStore((state) => state.signOut);
  const profile = useActiveProfile((state) => state.profile);

  const [activeTab, setActiveTab] = useState(0);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderRelease: (_, gestureState) => {
          const { dx, vx } = gestureState;
          if (Math.abs(dx) > 20 || Math.abs(vx) > 0.3) {
            if ((dx > 0 || vx > 0.3) && activeTab > 0) {
              setActiveTab((prev) => prev - 1);
              haptic();
            } else if (
              (dx < 0 || vx < -0.3) &&
              activeTab < TAB_LABELS.length - 1
            ) {
              setActiveTab((prev) => prev + 1);
              haptic();
            }
          }
        }
      }),
    [activeTab]
  );

  return (
    <View style={[styles.header, { paddingTop: top }]}>
      <View style={styles.tabs} {...panResponder.panHandlers}>
        {TAB_LABELS.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.7}
            onPress={() => {
              setActiveTab(index);
              haptic();
            }}
          >
            <Text style={[styles.tab, activeTab === index && styles.active]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <AnimatedButton
        onPress={() => signOut()}
        style={{ width: 35, height: 35 }}
      >
        <Image
          contentFit="cover"
          style={StyleSheet.absoluteFillObject}
          source={{ uri: getAvatar(profile) }}
        />
      </AnimatedButton>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  tabs: {
    flex: 1,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10
  },
  tab: {
    fontSize: normalizeFont(12),
    fontFamily: "Serif",
    opacity: 0.5
  },
  active: {
    fontSize: normalizeFont(18),
    opacity: 1
  }
});
