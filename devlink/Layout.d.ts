import * as React from "react";
import * as Types from "./types";

declare function Layout(props: {
  as?: React.ElementType;
  classes?: string;
  /** Can contain headings, paragraphs, buttons, and other primary content*/
  column1?: React.ReactNode;
  column1Classes?: string;
  /** Can contain images, videos, forms, sliders, and other secondary content. For breakout, full, contain, and card variants, this slot needs to contain a visual.*/
  column2?: React.ReactNode;
  column2Classes?: string;
  variant?:
    | "Stack"
    | "Stack Centered"
    | "Auto Width"
    | "Columns"
    | "Columns Reversed"
    | "Sticky Left"
    | "Breakout"
    | "Breakout Reversed"
    | "Full"
    | "Full Reversed"
    | "Contain"
    | "Contain Reversed"
    | "Card";
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
