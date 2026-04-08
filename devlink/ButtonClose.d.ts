import * as React from "react";
import * as Types from "./types";

declare function ButtonClose(props: {
  as?: React.ElementType;
  attribute1Name?: string;
  attribute1Value?: string;
  attribute2Name?: string;
  attribute2Value?: string;
  classes?: string;
  link?: Types.Basic.Link;
  /** This is the text screen readers will read when focused on the button.*/
  text?: React.ReactNode;
  variant?:
    | "Primary / Medium"
    | "Secondary / Medium"
    | "Primary / Large"
    | "Secondary / Large";
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
