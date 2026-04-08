import * as React from "react";
import * as Types from "./types";

declare function Modal(props: {
  as?: React.ElementType;
  classes?: string;
  modalContent?: React.ReactNode;
  /** Each modal must have a unique ID. When using a modal inside a CMS Item, use the CMS Item's slug as the ID.*/
  modalId?: string;
  /** If set to true, modal will be visible in designer.*/
  showInDesigner?: Types.Boolean.Boolean;
  variant?: "Small" | "Side Panel" | "Full Screen";
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
