import { File } from "expo-file-system";
import { launchImageLibraryAsync } from "expo-image-picker";
import { use, useEffect } from "react";
import { Alert } from "react-native";
import type { Spec } from "react-native-video-trim";
import NativeVideoTrim, {
	cleanFiles,
	showEditor,
} from "react-native-video-trim";
import { VideoContext } from "../context/VideoContext";
import { VIDEO_DIRECTORY } from "../utils/constants";
import { formatDate } from "../utils/formatDate";

export function useVideoFileManagement() {
	const { addVideo, removeVideo } = use(VideoContext);
	const { pendingDate } = use(VideoContext);

	// biome-ignore lint/correctness/useExhaustiveDependencies: To implement better in the future
	useEffect(() => {
		const subscription = (NativeVideoTrim as Spec).onFinishTrimming(
			({ outputPath, startTime, endTime }) => {
				if (endTime - startTime > 1550) {
					Alert.alert(
						"La vidéo est trop longue",
						"Veuillez réduire la durée de la vidéo à 1.5 secondes",
					);
				} else if (pendingDate.current && outputPath) {
					saveDailyVideo(pendingDate.current, outputPath);
				}
				pendingDate.current = null;
				cleanFiles();
			},
		);

		return () => {
			subscription?.remove();
		};
	}, []);

	async function hasVideoForDate(date: Date): Promise<boolean> {
		try {
			if (!VIDEO_DIRECTORY.exists) {
				return false;
			}
			const fileName = `${formatDate(date)}.mp4`;
			const destinationVideo = new File(VIDEO_DIRECTORY, fileName);
			return destinationVideo.exists;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	async function saveDailyVideo(date: string, videoUri: string) {
		try {
			if (!VIDEO_DIRECTORY.exists) {
				VIDEO_DIRECTORY.create();
			}
			const fileName = `${date}.mp4`;
			const originVideo = new File(
				videoUri.startsWith("file://") ? videoUri : `file://${videoUri}`,
			);
			const destinationVideo = new File(VIDEO_DIRECTORY, fileName);

			originVideo.copy(destinationVideo);
			if (destinationVideo.exists) {
				await addVideo(date, destinationVideo.uri);
			} else {
				throw new Error("Copy failed");
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function deleteDailyVideo(date: string, videoUri: string) {
		try {
			const videoFile = new File(videoUri);
			if (videoFile.exists) {
				videoFile.delete();
			}
			await removeVideo(date);
		} catch (error) {
			console.error(error);
		}
	}

	async function pickVideo(date: string) {
		const result = await launchImageLibraryAsync({
			mediaTypes: "videos",
			allowsEditing: true,
			quality: 1,
		});
		if (result.assets) {
			if (result.assets[0].duration && result.assets[0].duration < 1500) {
				saveDailyVideo(date, result.assets[0].uri);
			} else {
				pendingDate.current = date;
				showEditor(result.assets[0].uri, {
					autoplay: true,
					minDuration: 1.5,
					enableSaveDialog: false,
					enableCancelDialog: false,
				});
			}
		}
	}

	return {
		hasVideoForDate,
		saveDailyVideo,
		deleteDailyVideo,
		pickVideo,
	};
}
