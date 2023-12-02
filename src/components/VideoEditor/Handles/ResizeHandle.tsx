import { FC, useState } from "react";
import { DraggableCore, DraggableCoreProps } from "react-draggable";
import { calcRelativeDelta, formatTime } from "../../../utils/video";

type Props = {
  time: number;
  value: number;
  onChange: (value: number) => void;
  position: "left" | "right";
  containerRef: React.RefObject<HTMLDivElement>;
};

export const ResizeHandle: FC<Partial<DraggableCoreProps> & Props> = ({
  time,
  value,
  onChange,
  position,
  containerRef,
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <DraggableCore
      {...props}
      nodeRef={containerRef}
      onStart={(...args) => {
        props.onStart?.(...args);
        setIsDragging(true);
      }}
      onStop={(...args) => {
        props.onStop?.(...args);
        setIsDragging(false);
      }}
      onDrag={(_, data) => {
        const deltaX = calcRelativeDelta(containerRef.current, data);
        onChange(value + deltaX);
      }}
    >
      <div
        className={`resize-handle ${position}`}
        data-dragging={isDragging}
        data-time={formatTime(time)}
      />
    </DraggableCore>
  );
};
