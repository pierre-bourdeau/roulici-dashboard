import * as React from "react";
import * as Types from "./types";

declare function IFrame(props: {
  as?: React.ElementType;
  classes?: string;
  style?: string;
  title?: string;
  url?: string;
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
