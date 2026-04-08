import * as React from "react";
import * as Types from "./types";

declare function FormLabelText(props: {
  as?: React.ElementType;
  classes?: string;
  tag?: Types.Basic.TagType;
  /** Field label shown on page*/
  text?: React.ReactNode;
  variant?: "Visible" | "Hidden" | "Bold";
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
