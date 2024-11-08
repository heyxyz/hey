import { Colors } from "@/helpers/colors";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";

export const Background = ({ children }: PropsWithChildren) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(360 * 1000, {
      duration: 20000 * 1000,
      easing: Easing.linear
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    const rotationValue = rotation.value % 360;
    return {
      transform: [{ rotate: `${rotationValue}deg` }]
    };
  });

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
      <Animated.Image
        style={[{ width: 400, height: 400, marginTop: -300 }, animatedStyle]}
        source={require("../../assets/images/auth-el.png")}
      />
      <Animated.Image
        style={[{ width: 400, height: 400, marginBottom: -300 }, animatedStyle]}
        source={require("../../assets/images/auth-el.png")}
      />
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.background
  }
});
