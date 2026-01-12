import AsyncStorage from "@react-native-async-storage/async-storage";
import { File } from "expo-file-system";
import { VIDEO_DIRECTORY } from "./constants";
import { get } from "./storage";

export async function cleanupOrphanedFiles() {
	try {
		const videoMap = await get("videos");
		const files = VIDEO_DIRECTORY.list();

		// Delete files that don't have an entry in AsyncStorage
		for (const file of files) {
			const date = file.name.replace(".mp4", "");
			if (!videoMap[date]) {
				const orphanFile = new File(VIDEO_DIRECTORY, file.name);
				if (orphanFile.exists) {
					orphanFile.delete();
				}
			}
		}

		// Delete AsyncStorage entries that point to non-existent files
		for (const date in videoMap) {
			const uri = videoMap[date];
			const file = new File(uri);
			if (!file.exists) {
				delete videoMap[date];
				await AsyncStorage.setItem("videos", JSON.stringify(videoMap));
			}
		}

		console.info("Orphaned files cleanup completed");
	} catch (error) {
		console.error("Cleanup error:", error);
	}
}
