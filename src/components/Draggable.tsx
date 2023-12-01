import { FC, useLayoutEffect, useState } from "react";

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

type ResizeHandleProps = {
  onDrag: (ev: MouseEvent, data: { deltaX: number }) => void;
};

export const ResizeHandle: FC<Omit<DivProps, "onDrag"> & ResizeHandleProps> = ({
  onDrag,
  ...props
}) => {
  const [canDrag, setCanDrag] = useState(false);
  useLayoutEffect(() => {
    const resizeHandler = (ev: MouseEvent) => {
      if (!canDrag) return;
      onDrag(ev as MouseEvent, { deltaX: ev.movementX });
    };

    const mouseUpHandler = () => setCanDrag(false);
    window.addEventListener("mousemove", resizeHandler);
    window.addEventListener("mouseup", mouseUpHandler);

    return () => {
      window.removeEventListener("mousemove", resizeHandler);
      window.removeEventListener("mouseup", () => setCanDrag(false));
    };
  }, [canDrag, onDrag]);

  return (
    <div
      {...props}
      onMouseDown={(ev) => {
        setCanDrag(true);
        props.onMouseDown?.(ev);
      }}
      style={{
        width: 16,
        userSelect: "none",
        background: "#ffb800",
        ...props.style,
      }}
    ></div>
  );
};
