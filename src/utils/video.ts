import { DraggableData } from "react-draggable";

export const generateVideoThumbnail = (
  src: string,
  framesAmount: number = 25
): Promise<string[]> => {
  return new Promise((resolve) => {
    const scale = 0.5;
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");

    const ctx = canvas.getContext("2d");

    video.autoplay = false;
    video.muted = true;
    video.src = src;
    video.crossOrigin = "anonymous";

    const frames: string[] = [];

    const getFrame = async () => {
      ctx?.drawImage(
        video,
        0,
        0,
        video.videoWidth * scale,
        video.videoHeight * scale
      );

      const dataUrl = canvas.toDataURL("image/png");
      const blob = await (await fetch(dataUrl)).blob();
      return URL.createObjectURL(blob);
    };

    video.onloadeddata = async () => {
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;

      const interval = video.duration / framesAmount;
      for (let i = 0; i < framesAmount; i++) {
        await new Promise((res) => {
          video.onseeked = res;
          video.currentTime = interval * i;
        });

        frames.push(await getFrame());
      }

      resolve(frames);
    };
  });
};

export const limit = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

export const getRelativeClickPosition = (
  event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  element: HTMLDivElement
) => {
  const { left, width } = element.getBoundingClientRect();
  const x = event.clientX - left;
  const percent = (x / width) * 100;
  return percent;
};

export const calcRelativeDelta = (
  element: HTMLDivElement | null,
  data: DraggableData
) => {
  return (data.deltaX / (element?.clientWidth || 1)) * 100;
};

export const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  let formattedTime = `${minutes}:${seconds}`;

  if (hours > 0) {
    const formattedHours = hours.toString().padStart(2, "0");
    formattedTime = `${formattedHours}:${formattedTime}`;
  }

  return formattedTime;
};
