import * as React from "react";
import * as Types from "./types";

declare function TypographyParagraph(props: {
  as?: React.ElementType;
  classes?: string;
  id?: Types.Basic.IdTextInput;
  /** Set "-1" for no max width*/
  maxWidth?: number;
  text?: Types.Basic.RichTextChildren;
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
