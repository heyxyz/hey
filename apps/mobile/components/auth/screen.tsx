import { Colors } from "@/helpers/colors";
import normalizeFont from "@/helpers/normalize-font";
import { useAuthStore } from "@/store/auth";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Background } from "./background";
import { Scan } from "./scan";

export const AuthScreen = () => {
  const id = useAuthStore((state) => state.session.id);

  const opacity = useSharedValue(0);
  const opacityStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      opacity: opacity.value
    };
  });
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 200 });
  }, []);

  return (
    <Background>
      <StatusBar style="dark" key="auth" />
      <BlurView tint="light" style={styles.blurView} intensity={100}>
        <SafeAreaView style={{ flex: 1 }}>
          <Animated.View
            style={[
              opacityStyle,
              styles.container,
              { justifyContent: id ? "center" : "space-between" }
            ]}
          >
            <Text style={styles.hey}>hey</Text>
            {!id && <Scan />}
          </Animated.View>
        </SafeAreaView>
      </BlurView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center"
  },
  blurView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  hey: {
    fontFamily: "Serif",
    fontSize: normalizeFont(42),
    lineHeight: normalizeFont(42),
    paddingTop: 20,
    color: Colors.text
  }
});
