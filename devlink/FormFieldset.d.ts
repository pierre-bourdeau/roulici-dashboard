import * as React from "react";
import * as Types from "./types";

declare function FormFieldset(props: {
  as?: React.ElementType;
  attributeName?: string;
  attributeValue?: string;
  classes?: string;
  content?: React.ReactNode;
  legendText?: React.ReactNode;
  legendVariant?: "Visible" | "Hidden" | "Bold";
  /** Switch to "list" if containing a list of items*/
  slotRole?: string;
  variant?:
    | "Flex Vertical"
    | "Flex Horizontal"
    | "Grid 2 Column"
    | "Grid 3 Column";
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
