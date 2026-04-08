import * as React from "react";
import * as Types from "./types";

declare function FooterLink(props: {
  as?: React.ElementType;
  link?: Types.Basic.Link;
  text?: React.ReactNode;
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
