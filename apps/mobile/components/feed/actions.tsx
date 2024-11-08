import { Colors } from "@/helpers/colors";
import { Heart, MessageCircle, Repeat } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { AnimatedButton } from "../ui/animated-button";

export const Actions = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <AnimatedButton style={{ width: 40, height: 40 }}>
          <Heart size={18} color="black" />
        </AnimatedButton>
        <AnimatedButton style={{ width: 40, height: 40 }}>
          <MessageCircle size={18} color="black" />
        </AnimatedButton>
        <AnimatedButton style={{ width: 40, height: 40 }}>
          <Repeat size={18} color="black" />
        </AnimatedButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    bottom: 0,
    left: 0,
    right: 0,
    position: "absolute",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: Colors.white
  },
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    gap: 10
  }
});
