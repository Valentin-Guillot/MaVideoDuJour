import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { launchImageLibraryAsync } from "expo-image-picker";
import { saveDailyVideo } from "../utils/fileSystem";

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

  function handleSwitchCamera() {
    setFacing(facing === "back" ? "front" : "back");
  }

  function handleCapture() {
    console.log("capture");
  }

  async function handlePickImage() {
    const result = await launchImageLibraryAsync({
      mediaTypes: "videos",
      allowsEditing: true,
      quality: 1,
    });
    if (result.assets) {
      saveDailyVideo(result.assets[0].uri, new Date());
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} />
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={handlePickImage}>
            <Icon name="image" size={36} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCapture}>
            <Icon name="circle" size={64} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSwitchCamera}>
            <Icon name="camera-rotate" size={36} color="white" />
          </TouchableOpacity>
        </View>
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
  },
  backButton: {
    alignSelf: "flex-start",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
