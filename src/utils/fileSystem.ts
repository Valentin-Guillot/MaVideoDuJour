import { Directory, File, Paths } from "expo-file-system";

const VIDEO_DIRECTORY = new Directory(Paths.document, "daily-videos");

export const saveDailyVideo = async (videoUri: string, date: Date) => {
  try {
    if (!VIDEO_DIRECTORY.exists) {
      VIDEO_DIRECTORY.create();
    }
    const fileName = `${formatDate(date)}.mp4`;
    const originVideo = new File(videoUri);
    const destinationVideo = new File(VIDEO_DIRECTORY, fileName);

    const result = originVideo.copy(destinationVideo);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

export const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};
