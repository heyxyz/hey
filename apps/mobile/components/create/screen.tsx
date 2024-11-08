import { Colors } from "@/helpers/colors";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import { useState } from "react";
import {
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { AnimatedButton } from "../ui/animated-button";

export const CreateScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const hasPermission = permission?.granted;
  const [cameraKey, setCameraKey] = useState(0);

  const requestPermissionHandler = async () => {
    if (hasPermission) return;
    if (!permission?.canAskAgain) {
      Linking.openSettings();
      return;
    }
    const { granted } = await requestPermission();
    if (granted) {
      setCameraKey((prev) => prev + 1);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.black }}>
      <CameraView key={cameraKey} style={{ flex: 1 }}>
        <SafeAreaView style={styles.overlay}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingHorizontal: 15
            }}
          >
            <AnimatedButton
              style={{ width: 40, height: 40 }}
              onPress={() => router.back()}
            >
              <X size={24} color={Colors.black} />
            </AnimatedButton>
          </View>
          {hasPermission ? null : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={requestPermissionHandler}
            >
              <Text style={styles.text}>Allow camera?</Text>
            </TouchableOpacity>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              paddingHorizontal: 15,
              paddingBottom: 15
            }}
          >
            <AnimatedButton style={{ width: 75, height: 75, padding: 5 }}>
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 100,
                  borderWidth: 2,
                  borderColor: Colors.black,
                  backgroundColor: Colors.white
                }}
              />
            </AnimatedButton>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Sans",
    color: Colors.white
  },
  overlay: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    backgroundColor: Colors.white
  }
});
