import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ReactNode, RefObject } from "react";
import { createContext, useRef, useState } from "react";
import { get } from "../utils/storage";

interface VideoContextType {
	videoMap: Record<string, string>;
	refreshVideos: () => Promise<void>;
	addVideo: (date: string, uri: string) => Promise<void>;
	removeVideo: (date: string) => Promise<void>;
	pendingDate: RefObject<string | null>;
}

export const VideoContext = createContext<VideoContextType>({
	videoMap: {},
	refreshVideos: async () => {},
	addVideo: async () => {},
	removeVideo: async () => {},
	pendingDate: { current: null },
});

export function VideoProvider({ children }: { children: ReactNode }) {
	const [videoMap, setVideoMap] = useState<Record<string, string>>({});
	const pendingDate = useRef<string | null>(null);

	const refreshVideos = async () => {
		const map = await get("videos");
		setVideoMap(map);
	};

	const addVideo = async (date: string, uri: string) => {
		const newMap = { ...videoMap, [date]: uri };
		await AsyncStorage.setItem("videos", JSON.stringify(newMap));
		setVideoMap(newMap);
	};

	const removeVideo = async (date: string) => {
		const newMap = { ...videoMap };
		delete newMap[date];
		await AsyncStorage.setItem("videos", JSON.stringify(newMap));
		setVideoMap(newMap);
	};

	return (
		<VideoContext
			value={{
				videoMap,
				refreshVideos,
				addVideo,
				removeVideo,
				pendingDate,
			}}
		>
			{children}
		</VideoContext>
	);
}
