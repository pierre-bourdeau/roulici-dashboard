import * as React from "react";
import * as Types from "./types";

declare function FormSelectOption(props: {
  as?: React.ElementType;
  /** Add a space to make option hidden from list (sometimes used on placeholder option)*/
  hidden?: string;
  /** Add a space to make option selected by default*/
  selected?: string;
  text?: React.ReactNode;
  value?: string;
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
