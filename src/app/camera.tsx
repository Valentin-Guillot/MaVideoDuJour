import Icon from "@expo/vector-icons/FontAwesome6";
import type { CameraType } from "expo-camera";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideoFileManagement } from "../hooks/useVideoFileManagement";
import { formatDate } from "../utils/formatDate";

export default function Camera() {
	const router = useRouter();
	const { pickVideo } = useVideoFileManagement();

	const [facing, setFacing] = useState<CameraType>("back");
	const [isPickingVideo, setIsPickingVideo] = useState(false);

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

	async function handlePickVideo() {
		setIsPickingVideo(true);
		await pickVideo(formatDate(new Date()));
		router.back();
		setIsPickingVideo(false);
	}

	return (
		<View style={styles.container}>
			<CameraView style={styles.camera} facing={facing} />
			<SafeAreaView style={styles.safeArea}>
				<TouchableOpacity onPress={handleBack} style={styles.backButton}>
					<Icon name="arrow-left" size={24} color="white" />
				</TouchableOpacity>
				<View style={styles.buttonsContainer}>
					<TouchableOpacity onPress={handlePickVideo}>
						{isPickingVideo ? (
							<ActivityIndicator size={36} color="white" />
						) : (
							<Icon name="image" size={36} color="white" />
						)}
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
