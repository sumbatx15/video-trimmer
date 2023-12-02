import { FC, useRef } from "react";
import { ITrimmer } from "../../hooks/useVideoEditor/useVideoEditor";
import { limit } from "../../utils/video";
import { Deadzone } from "./Deadzone";
import { Frames } from "./Frames";
import { PlayHead } from "./Handles/PlayHead";
import { ResizeHandle } from "./Handles/ResizeHandle";
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
          <ResizeHandle
            position="left"
            time={(trimmer.start * duration) / 100}
            value={trimmer.start}
            containerRef={containerRef}
            onChange={(start) => {
              onChange({
                time: (start * duration) / 100,
                trimmer: {
                  start: limit(start, 0, trimmer.end),
                  end: trimmer.end,
                },
              });
            }}
          />

          <ResizeHandle
            position="right"
            time={(trimmer.end * duration) / 100}
            value={trimmer.end}
            containerRef={containerRef}
            onChange={(end) => {
              onChange({
                time: (end * duration) / 100,
                trimmer: {
                  start: trimmer.start,
                  end: limit(end, trimmer.start, 100),
                },
              });
            }}
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
