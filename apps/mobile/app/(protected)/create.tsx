import { CreateScreen } from "@/components/create/screen";
import { StyleSheet, View } from "react-native";

export default function CreateModal() {
  return (
    <View style={styles.container}>
      <CreateScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
