import * as React from "react";
import * as Types from "./types";

declare function ButtonMain(props: {
  as?: React.ElementType;
  attributeName?: string;
  attributeValue?: string;
  classes?: string;
  clickableVisibility?: Types.Visibility.VisibilityConditions;
  externalLink?: Types.Basic.Link;
  icon?: React.ReactNode;
  link?: Types.Basic.Link;
  text?: React.ReactNode;
  /** button, submit, reset*/
  type?: string;
  variant?: "Primary" | "Secondary" | "Link";
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
