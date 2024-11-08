import { Colors } from "@/helpers/colors";
import normalizeFont from "@/helpers/normalize-font";
import { refreshAuthTokens } from "@/helpers/refresh";
import { useAuthStore } from "@/store/auth";
import parseJwt from "@hey/helpers/parseJwt";
import { type Profile, useProfileQuery } from "@hey/lens";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { AnimatedButton } from "../ui/animated-button";
import { Instructions } from "./instructions";
import { ProfileView } from "./profile";

export const Scan = () => {
  const [readyToScan, setReadyToScan] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [cameraKey, setCameraKey] = useState(0);

  const [permission, requestPermission] = useCameraPermissions();
  const hasPermission = permission?.granted;

  const signIn = useAuthStore((state) => state.signIn);
  const { data } = useProfileQuery({
    variables: {
      request: { forProfileId: profileId }
    }
  });
  const profile = data?.profile as Profile;

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

  const signUserIn = async () => {
    const refresh = await refreshAuthTokens(tempToken);

    if (refresh) {
      await signIn({
        id: profileId,
        accessToken: refresh.accessToken,
        refreshToken: refresh.refreshToken
      });
    }
  };

  return (
    <>
      <View style={styles.container}>
        {readyToScan ? (
          profile ? (
            <ProfileView profile={profile} />
          ) : (
            <CameraView
              key={cameraKey}
              style={styles.camera}
              onBarcodeScanned={({ data }) => {
                const id = parseJwt(data)?.id;
                if (!id) return;
                setProfileId(id);
                setTempToken(data);
              }}
            >
              {hasPermission ? (
                <Text style={styles.text}>Show QR</Text>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={requestPermissionHandler}
                >
                  <Text style={styles.text}>Allow camera?</Text>
                </TouchableOpacity>
              )}
            </CameraView>
          )
        ) : (
          <Instructions />
        )}
      </View>
      <View style={{ paddingHorizontal: 10, width: "100%" }}>
        <AnimatedButton
          style={{ padding: 15 }}
          onPress={() => {
            if (!readyToScan) {
              requestPermissionHandler();
              setReadyToScan(true);
            }
            if (profile) {
              signUserIn();
            }
          }}
        >
          <Text style={styles.buttonText}>
            {readyToScan ? "Sign in" : "Scan now"}
          </Text>
        </AnimatedButton>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center"
  },
  camera: {
    height: 250,
    width: 250,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: Colors.black
  },
  text: {
    fontFamily: "Sans",
    color: Colors.white
  },
  buttonText: {
    fontFamily: "Sans",
    fontSize: normalizeFont(14),
    color: "#000",
    textAlign: "center"
  }
});
