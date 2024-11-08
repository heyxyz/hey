import { Colors } from "@/helpers/colors";
import normalizeFont from "@/helpers/normalize-font";
import { useAuthStore } from "@/store/auth";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Scan } from "./scan";

export const AuthScreen = () => {
  const id = useAuthStore((state) => state.session.id);

  return (
    <>
      <StatusBar style="dark" key="auth" />
      <SafeAreaView style={styles.container}>
        <Text style={styles.hey}>hey</Text>
        {!id && <Scan />}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center"
  },
  hey: {
    fontFamily: "Serif",
    fontSize: normalizeFont(42),
    lineHeight: normalizeFont(42),
    paddingTop: 20,
    color: Colors.text
  }
});
