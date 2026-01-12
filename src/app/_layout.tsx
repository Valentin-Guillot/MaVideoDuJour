import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { VideoProvider } from "../context/VideoContext";
import { cleanupOrphanedFiles } from "../utils/cleanupOrphanedFiles";

export default function RootLayout() {
	useEffect(() => {
		(async () => {
			await cleanupOrphanedFiles();
		})();
	}, []);
	return (
		<SafeAreaProvider>
			<VideoProvider>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="index" />
					<Stack.Screen
						name="camera"
						options={{ animation: "fade_from_bottom" }}
					/>
					<Stack.Screen
						name="video"
						options={{ animation: "fade_from_bottom" }}
					/>
				</Stack>
			</VideoProvider>
		</SafeAreaProvider>
	);
}
