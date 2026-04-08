import * as React from "react";
import * as Types from "./types";

declare function Clickable(props: {
  as?: React.ElementType;
  attributeName?: string;
  attributeValue?: string;
  externalLink?: Types.Basic.Link;
  link?: Types.Basic.Link;
  /** This is the text screen readers will read when focused on the link or button.*/
  screenReaderText?: React.ReactNode;
  /** button, submit, reset*/
  type?: string;
  variant?: "Focus Ring Outside" | "Focus Ring Inside";
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
