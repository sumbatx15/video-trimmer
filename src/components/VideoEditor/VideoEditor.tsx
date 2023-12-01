import { FC, useEffect, useState } from "react";
import { Timeline } from "./Timeline";
import { useQuery } from "@tanstack/react-query";
import { useVideo } from "../../hooks/useVideoEditor/useVideoEditor";
import { generateVideoThumbnail } from "../../utils/video";

export const VideoEditor: FC = () => {
  const [src, setSrc] = useState("");
  const frames = useQuery({
    queryKey: ["frames", src],
    queryFn: async () => generateVideoThumbnail(src),
    enabled: !!src,
  });

  useEffect(() => {
    const _src =
      prompt(
        "Enter video url or just leave it empty, ill put on a nice drifting video for you"
      ) ||
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";
    setSrc(_src);
  }, []);

  const { ref, time, setTime, trimmer, setTrimmer, duration } = useVideo();

  return (
    <div className="video-editor">
      <h1>
        ✨ VIDEO<span>TRIMMER</span>
      </h1>
      <video
        style={{
          maxWidth: "100%",
          borderRadius: "10px",
        }}
        ref={ref}
        controls
        src={src}
      />
      <Timeline
        time={time}
        trimmer={trimmer}
        duration={duration}
        frames={frames.data || []}
        onChange={(change) => {
          setTime(change.time);
          setTrimmer(change.trimmer);
        }}
      />
    </div>
  );
};
