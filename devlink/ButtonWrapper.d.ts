import * as React from "react";
import * as Types from "./types";

declare function ButtonWrapper(props: {
  as?: React.ElementType;
  classes?: string;
  content?: React.ReactNode;
  style?: string;
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
