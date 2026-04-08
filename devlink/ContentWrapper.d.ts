import * as React from "react";
import * as Types from "./types";

declare function ContentWrapper(props: {
  as?: React.ElementType;
  classes?: string;
  content?: React.ReactNode;
  style?: string;
  variant?: "Inherit" | "Left" | "Center" | "Right" | "Center Mobile";
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
