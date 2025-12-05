import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";

export default function Camera() {
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>("back");

  const [permission, requestPermission] = useCameraPermissions();
  if (!permission?.granted) {
    requestPermission();
  }

  function handleBack() {
    router.back();
  }

  function handleCapture() {
    console.log("capture");
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} />
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCapture}>
          <Icon name="circle" size={64} color="red" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  safeArea: {
    position: "absolute",
    inset: 0,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
  },
});
