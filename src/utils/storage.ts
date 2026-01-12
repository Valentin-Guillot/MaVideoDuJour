import AsyncStorage from "@react-native-async-storage/async-storage";

export async function get(key: string) {
	const value = await AsyncStorage.getItem(key);
	return value ? JSON.parse(value) : {};
}
