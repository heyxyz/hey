import { addEventListener } from "@react-native-community/netinfo";
import type React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export const NetInfoProvider: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  if (!isOffline) return null;

  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>You are offline</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  offlineContainer: {
    top: 0,
    zIndex: 2,
    width: "100%",
    paddingVertical: 1,
    position: "absolute",
    alignItems: "center",
    backgroundColor: "red"
  },
  offlineText: {
    fontSize: 7,
    color: "white",
    fontFamily: "Sans"
  }
});
