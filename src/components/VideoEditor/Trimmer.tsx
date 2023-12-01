import { useEffect, useRef } from "react";
import { DraggableCore, DraggableEventHandler } from "react-draggable";
import { ITrimmer as ITrimmer } from "../../hooks/useVideoEditor/useVideoEditor";
import { getRelativeClickPosition, limit } from "../../utils/video";

type Props = {
  containerRef: React.RefObject<HTMLDivElement>;
  trimmer: ITrimmer;
  duration: number;
  onChange: (change: { time: number; trimmer: ITrimmer }) => void;
  children: React.ReactNode;
};

export const Trimmer = ({
  containerRef,
  trimmer,
  duration,
  onChange,
  children,
}: Props) => {
  const isClick = useRef(true);
  const trimmerRef = useRef<HTMLDivElement>(null);

  const trimmerWidth = trimmer.end - trimmer.start;

  const handleTrimmerDrag: DraggableEventHandler = (_, data) => {
    const width = containerRef.current?.clientWidth || 1;
    const deltaX = (data.deltaX / width) * 100;
    const start = limit(trimmer.start + deltaX, 0, 100 - trimmerWidth);
    const end = limit(trimmer.end + deltaX, trimmerWidth, 100);

    onChange({
      time: (start * duration) / 100,
      trimmer: { start, end },
    });
  };

  useEffect(() => {
    const handler = () => (isClick.current = false);
    const el = trimmerRef.current;
    el?.addEventListener("mousemove", handler);
    return () => el?.removeEventListener("mousemove", handler);
  }, []);

  return (
    <DraggableCore onDrag={handleTrimmerDrag}>
      <div
        ref={trimmerRef}
        className="trimmer"
        style={{
          width: `${trimmer.end - trimmer.start}%`,
          left: `${trimmer.start}%`,
        }}
        onMouseDownCapture={() => (isClick.current = true)}
        onMouseUpCapture={(ev) => {
          if (!isClick.current) return;
          const percent = getRelativeClickPosition(ev, containerRef.current!);

          onChange({
            time: (percent * duration) / 100,
            trimmer: trimmer,
          });
        }}
      >
        {children}
      </div>
    </DraggableCore>
  );
};
