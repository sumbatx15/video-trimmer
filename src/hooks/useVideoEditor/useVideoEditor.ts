import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { useVideoTimeController } from "./useVideoTimeController";

export type ITrimmer = {
  start: number;
  end: number;
};

export const useVideo = () => {
  const ref = useRef<HTMLVideoElement>(null);
  const [trimmer, setTrimmer] = useState<ITrimmer>({
    start: 20,
    end: 60,
  });

  const duration = useSyncExternalStore(
    (callback) => {
      ref.current?.addEventListener("loadeddata", callback);
      return () => ref.current?.removeEventListener("loadeddata", callback);
    },
    () => ref.current?.duration || 1
  );

  const playing = useSyncExternalStore(
    (callback) => {
      const _play = () => {
        play();
        callback();
      };
      ref.current?.addEventListener("play", _play);
      ref.current?.addEventListener("pause", callback);
      ref.current?.addEventListener("ended", callback);
      return () => {
        ref.current?.removeEventListener("play", _play);
        ref.current?.removeEventListener("pause", callback);
        ref.current?.removeEventListener("ended", callback);
      };
    },
    () => !ref.current?.paused
  );

  const { time, setTime, timeLimits } = useVideoTimeController({
    ref,
    trimmer,
    duration,
    playing,
  });

  const play = useCallback(() => {
    if (ref.current) {
      if (time <= timeLimits.min || time >= timeLimits.max) {
        ref.current.currentTime = timeLimits.min;
      }
      ref.current.play();
    }
  }, [time, timeLimits.max, timeLimits.min]);

  return {
    play,
    ref,
    time,
    setTime,
    trimmer,
    setTrimmer,
    playing,
    duration,
  };
};
