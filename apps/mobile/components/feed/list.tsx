import { Colors } from "@/helpers/colors";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export const List = () => {
  const isLoading = false;

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} color={Colors.black} />;
  }

  return (
    <View style={styles.container}>
      <Text>Feed</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
