import * as React from "react";
import * as Types from "./types";

declare function AccordionList(props: {
  as?: React.ElementType;
  accordionItem?: React.ReactNode;
  classes?: string;
  /** If set to true, accordion will close the second time we click on it.*/
  closeOnSecondClick?: Types.Boolean.Boolean;
  /** If set to true, currently open accordion will close when new one opens.*/
  closePrevious?: Types.Boolean.Boolean;
  /** If set to 1, accordion item 1 will be opened by default.*/
  openByDefaultItem?: number;
  /** If set to true, accordion will open when we hover over it.*/
  openOnHover?: Types.Boolean.Boolean;
  style?: string;
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
