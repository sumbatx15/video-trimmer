export const generateVideoThumbnail = (
  src: string,
  framesAmount: number = 25
): Promise<string[]> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");

    const ctx = canvas.getContext("2d");

    video.autoplay = false;
    video.muted = true;
    video.src = src;
    video.crossOrigin = "anonymous";

    const frames: string[] = [];

    const getFrame = async () => {
      ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      const dataUrl = canvas.toDataURL("image/png");
      const blob = await (await fetch(dataUrl)).blob();
      return URL.createObjectURL(blob);
    };

    video.onloadeddata = async () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

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
