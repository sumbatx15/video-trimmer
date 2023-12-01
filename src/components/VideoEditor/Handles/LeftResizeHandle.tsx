import { DraggableCore } from "react-draggable";
import { ITrimmer } from "../../../hooks/useVideoEditor/useVideoEditor";
import { limit } from "../../../utils/video";

type Props = {
  containerRef: React.RefObject<HTMLDivElement>;
  trimmer: ITrimmer;
  duration: number;
  onChange: (change: { time: number; trimmer: ITrimmer }) => void;
};

export const LeftResizeHandle = ({
  containerRef,
  trimmer,
  duration,
  onChange,
}: Props) => {
  return (
    <DraggableCore
      onMouseDown={(ev) => ev.stopPropagation()}
      nodeRef={containerRef}
      onDrag={(_, data) => {
        const containerW = containerRef.current?.clientWidth || 1;
        const deltaX = (data.deltaX / containerW) * 100;
        const start = limit(trimmer.start + deltaX, 0, trimmer.end);
        onChange({
          time: (start * duration) / 100,
          trimmer: {
            start: start,
            end: trimmer.end,
          },
        });
      }}
    >
      <div className="resize-handle left" />
    </DraggableCore>
  );
};
