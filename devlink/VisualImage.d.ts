import * as React from "react";
import * as Types from "./types";

declare function VisualImage(props: {
  as?: React.ElementType;
  altText?: Types.Basic.AltText;
  attributeName?: string;
  attributeValue?: string;
  classes?: string;
  image?: Types.Asset.Image;
  /** Switch the value to "eager" when image is used at the top of the page.*/
  loading?: string;
  style?: string;
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
