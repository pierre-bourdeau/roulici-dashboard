import * as React from "react";
import * as Types from "./types";

declare function TabLink(props: {
  as?: React.ElementType;
  classes?: string;
  /** To anchor link to this item from another page, give this item a unique ID.*/
  itemId?: string;
  text?: React.ReactNode;
  variant?: "Link" | "Button";
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
