import { useCallback, useSyncExternalStore } from "react";
import { limit } from "../../utils/video";
import { useSubscribe } from "../useSubscribe";

interface UseTimeProps {
  ref: React.MutableRefObject<HTMLVideoElement | null>;
  trimmer: { start: number; end: number };
  duration: number;
  playing: boolean;
}

export const useVideoTimeController = ({
  ref,
  trimmer,
  duration,
  playing,
}: UseTimeProps) => {
  const { subscribe, unsubscribe, notify } = useSubscribe();

  const timeLimits = {
    min: +((trimmer.start / 100) * duration).toFixed(6),
    max: +((trimmer.end / 100) * duration).toFixed(6),
  };

  const time = useSyncExternalStore(
    (callback) => {
      const timeupdate = () => {
        if (!ref.current) return;
        const time = ref.current.currentTime;

        const shouldReplay = playing && time >= timeLimits.max;
        if (shouldReplay) ref.current.currentTime = timeLimits.min;

        if (!playing) {
          const isOutOfBounds = time < timeLimits.min || time > timeLimits.max;
          if (isOutOfBounds)
            ref.current.currentTime = limit(
              time,
              timeLimits.min,
              timeLimits.max
            );
        }
        callback();
      };

      subscribe(callback);
      ref.current?.addEventListener("timeupdate", timeupdate);

      return () => {
        unsubscribe(callback);
        ref.current?.removeEventListener("timeupdate", timeupdate);
      };
    },
    () => ref.current?.currentTime || 0
  );

  const setTime = useCallback(
    (time: number) => {
      if (ref.current) {
        ref.current.currentTime = limit(time, timeLimits.min, timeLimits.max);
        notify();
      }
    },
    [ref, timeLimits.min, timeLimits.max, notify]
  );

  return { time, setTime, timeLimits };
};
