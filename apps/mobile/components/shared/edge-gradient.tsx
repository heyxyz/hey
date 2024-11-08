import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const EdgeGradient = () => {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <>
      <View style={[styles.container, { height: top, top: 0 }]}>
        <LinearGradient
          colors={["#FFFFFF", "#FFFFFF00"]}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      <View style={[styles.container, { height: bottom, bottom: 0 }]}>
        <LinearGradient
          colors={["#FFFFFF00", "#FFFFFF"]}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1
  }
});
