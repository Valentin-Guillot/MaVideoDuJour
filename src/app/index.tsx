import { useRouter } from "expo-router";
import { use, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import type { DateData, MarkedDates } from "react-native-calendars/src/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { VideoContext } from "../context/VideoContext";
import { useVideoFileManagement } from "../hooks/useVideoFileManagement";
import { formatDate } from "../utils/formatDate";

export default function Home() {
	const router = useRouter();
	const { videoMap, refreshVideos } = use(VideoContext);
	const { hasVideoForDate, pickVideo } = useVideoFileManagement();

	const [isPickingVideo, setIsPickingVideo] = useState(false);

	useEffect(() => {
		refreshVideos();
	}, [refreshVideos]);

	const markedDates: MarkedDates = {};
	for (const date in videoMap) {
		markedDates[date] = {
			selected: true,
		};
	}

	async function handleDayPress(day: DateData) {
		if (await hasVideoForDate(new Date(day.dateString))) {
			router.push(
				`/video?videoUri=${videoMap[day.dateString]}&date=${day.dateString}`,
			);
			return;
		}
		if (day.dateString === formatDate(new Date())) {
			router.push("/camera", {});
		} else {
			setIsPickingVideo(true);
			await pickVideo(day.dateString);
			setIsPickingVideo(false);
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<Calendar
				onDayPress={handleDayPress}
				enableSwipeMonths
				markedDates={markedDates}
				showSixWeeks
				firstDay={1}
				style={styles.calendar}
				maxDate={formatDate(new Date())}
				displayLoadingIndicator={isPickingVideo}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	calendar: {
		marginTop: "30%",
	},
});
