import * as React from "react";
import * as Types from "./types";

declare function IconButton(props: {
  as?: React.ElementType;
  attributeLabel?: string;
  attributeValue?: string;
  clickableLink?: Types.Basic.Link;
  /** This is the text screen readers will read when focused on the link or button.*/
  clickableScreenReaderText?: React.ReactNode;
  icon?: React.ReactNode;
  visibility?: Types.Boolean.Boolean;
}): React.JSX.Element;
