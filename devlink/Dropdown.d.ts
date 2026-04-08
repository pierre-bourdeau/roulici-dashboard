import * as React from "react";
import * as Types from "./types";

declare function Dropdown(props: {
  as?: React.ElementType;
  closeOnHoverOut?: Types.Boolean.Boolean;
  content?: React.ReactNode;
  openOnHoverIn?: Types.Boolean.Boolean;
  /** If set to true, dropdown will be previewed as open in designer view.*/
  preview?: Types.Boolean.Boolean;
  text?: React.ReactNode;
  visibility?: Types.Boolean.Boolean;
}): React.JSX.Element;
