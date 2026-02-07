import Icon from "@expo/vector-icons/FontAwesome6";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useState } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideoFileManagement } from "../hooks/useVideoFileManagement";

export default function Video() {
	const router = useRouter();
	const { videoUri, date } = useLocalSearchParams<{
		videoUri: string;
		date: string;
	}>();
	const [isDeleting, setIsDeleting] = useState(false);
	const { deleteDailyVideo } = useVideoFileManagement();

	const player = useVideoPlayer(videoUri, (player) => {
		player.loop = true;
		player.play();
	});

	function handleBack() {
		router.back();
	}

	function handleDelete() {
		setIsDeleting(true);
		deleteDailyVideo(date, videoUri);
		setIsDeleting(false);
		router.back();
	}

	return (
		<View style={styles.container}>
			<VideoView player={player} style={styles.video} nativeControls={false} />
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.buttonsContainer}>
					<TouchableOpacity
						onPress={handleBack}
						style={styles.backButton}
						hitSlop={20}
					>
						<Icon name="arrow-left" size={24} color="white" />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={handleDelete}
						style={styles.deleteButton}
						hitSlop={20}
					>
						{isDeleting ? (
							<ActivityIndicator size="small" color="red" />
						) : (
							<Icon name="trash" size={24} color="red" />
						)}
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "black",
	},
	video: {
		width: "100%",
		height: "100%",
	},
	safeArea: {
		position: "absolute",
		inset: 0,
		paddingHorizontal: 20,
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	backButton: {
		alignSelf: "flex-start",
	},
	deleteButton: {
		marginHorizontal: 10,
		alignSelf: "flex-end",
	},
});
