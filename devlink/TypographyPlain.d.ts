import * as React from "react";
import * as Types from "./types";

declare function TypographyPlain(props: {
  as?: React.ElementType;
  classes?: string;
  /** Set "-1" for no max width*/
  maxWidth?: number;
  style?: string;
  tag?: Types.Basic.TagType;
  text?: React.ReactNode;
  variant?:
    | "Inherit"
    | "Text Small"
    | "Text Main"
    | "Text Large"
    | "H6"
    | "H5"
    | "H4"
    | "H3"
    | "H2"
    | "H1"
    | "Display";
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
