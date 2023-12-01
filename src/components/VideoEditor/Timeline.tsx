import { FC, useRef } from "react";
import { ITrimmer } from "../../hooks/useVideoEditor/useVideoEditor";
import { Deadzone } from "./Deadzone";
import { Frames } from "./Frames";
import { LeftResizeHandle } from "./Handles/LeftResizeHandle";
import { PlayHead } from "./Handles/PlayHead";
import { RightResizeHandle } from "./Handles/RightResizeHandle";
import { Trimmer } from "./Trimmer";
import "./styles.scss";

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export type TimelineProps = {
  time: number;
  trimmer: ITrimmer;
  frames: string[];
  duration: number;
  playing?: boolean;
  onChange: (change: { time: number; trimmer: ITrimmer }) => void;
};

export const Timeline: FC<
  TimelineProps & Omit<DivProps, keyof TimelineProps>
> = ({ time, duration, trimmer, frames, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="timeline-container">
      <div ref={containerRef} className="timeline-bar">
        <Frames frames={frames} />
        <PlayHead
          containerRef={containerRef}
          time={time}
          trimmer={trimmer}
          duration={duration}
          onChange={onChange}
        />
        <Deadzone
          style={{
            left: 0,
            width: `${trimmer.start}%`,
          }}
        />
        <Trimmer
          containerRef={containerRef}
          trimmer={trimmer}
          duration={duration}
          onChange={onChange}
        >
          <LeftResizeHandle
            containerRef={containerRef}
            trimmer={trimmer}
            duration={duration}
            onChange={onChange}
          />
          <RightResizeHandle
            containerRef={containerRef}
            trimmer={trimmer}
            duration={duration}
            onChange={onChange}
          />
        </Trimmer>
        <Deadzone
          style={{
            left: `${trimmer.end}%`,
            right: 0,
          }}
        />
      </div>
    </div>
  );
};
