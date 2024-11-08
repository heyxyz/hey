import normalizeFont from "@/helpers/normalize-font";
import { StyleSheet, Text, View } from "react-native";

export const Instructions = () => {
  return (
    <View style={{ gap: 10, marginTop: -20 }}>
      <Text style={styles.text}>GM</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Sans",
    fontSize: normalizeFont(14)
  }
});
