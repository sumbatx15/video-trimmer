import { FC } from "react";

export const Frames: FC<{ frames: string[] }> = ({ frames }) => (
  <div className="frames-container">
    {frames?.map((frame, i) => (
      <img key={i} src={frame || ""} className="frame" />
    ))}
  </div>
);
