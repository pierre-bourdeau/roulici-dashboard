import * as React from "react";
import * as Types from "./types";

declare function FooterGroup(props: {
  as?: React.ElementType;
  footerLink?: React.ReactNode;
  title?: React.ReactNode;
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
