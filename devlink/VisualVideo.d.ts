import * as React from "react";
import * as Types from "./types";

declare function VisualVideo(props: {
  as?: React.ElementType;
  attributeName?: string;
  attributeValue?: string;
  autoplay?: string;
  classes?: string;
  loop?: string;
  muted?: string;
  style?: string;
  url?: string;
  variant?:
    | "Wide 2 / 1"
    | "Wide 16 / 9"
    | "Wide 3 / 2"
    | "Wide 5 / 4"
    | "Square 1 / 1"
    | "Tall 4 / 5"
    | "Tall 2 / 3"
    | "Cover";
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
