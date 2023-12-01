import { DraggableCore } from "react-draggable";
import { ITrimmer } from "../../../hooks/useVideoEditor/useVideoEditor";
import { limit } from "../../../utils/video";

type Props = {
  containerRef: React.RefObject<HTMLDivElement>;
  time: number;
  trimmer: ITrimmer;
  duration: number;
  onChange: (change: { time: number; trimmer: ITrimmer }) => void;
};

export const PlayHead = ({
  containerRef,
  time,
  trimmer,
  duration,
  onChange,
}: Props) => {
  const playHeadX = limit((time / duration) * 100, trimmer.start, trimmer.end);

  return (
    <DraggableCore
      onMouseDown={(ev) => ev.stopPropagation()}
      onDrag={(_, data) => {
        const width = containerRef.current?.clientWidth || 1;
        const deltaXPercent = (data.deltaX / width) * 100;
        const newTime = limit(
          playHeadX + deltaXPercent,
          trimmer.start,
          trimmer.end
        );
        onChange({
          time: newTime * (duration / 100),
          trimmer,
        });
      }}
    >
      <div
        className="play-head-container"
        style={{ left: `calc(${playHeadX}% - 3px)` }}
      >
        <div className="play-head" />
      </div>
    </DraggableCore>
  );
};
