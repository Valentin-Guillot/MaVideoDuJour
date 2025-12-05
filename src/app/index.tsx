import { useRouter } from "expo-router";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const router = useRouter();

  function handleDayPress(day: any) {
    router.push("/camera", {});
  }

  return (
    <SafeAreaView>
      <Calendar onDayPress={handleDayPress} />
    </SafeAreaView>
  );
}
