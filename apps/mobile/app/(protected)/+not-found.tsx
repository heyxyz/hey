import normalizeFont from "@/helpers/normalize-font";
import { Link, Stack, usePathname } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  const pathname = usePathname();
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>
        <Text style={styles.pathname}>{pathname}</Text>
        <Link href="/(protected)/(feed)" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  link: {
    marginTop: 15,
    paddingVertical: 15
  },
  linkText: {
    fontFamily: "Sans",
    fontSize: normalizeFont(14),
    color: "#2e78b7"
  },
  pathname: {
    fontFamily: "Sans",
    fontSize: normalizeFont(14),
    color: "#666"
  },
  title: {
    fontSize: normalizeFont(20),
    fontFamily: "Serif"
  }
});
