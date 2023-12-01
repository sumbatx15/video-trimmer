import { FC } from "react";

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
export const Deadzone: FC<DivProps> = (props) => (
  <div {...props} className={"deadzone " + (props.className ?? "")} />
);
