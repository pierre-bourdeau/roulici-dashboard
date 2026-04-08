import * as React from "react";
import * as Types from "./types";

declare function CardPrimary(props: {
  as?: React.ElementType;
  classes?: string;
  contentClasses?: string;
  externalLink?: Types.Basic.Link;
  headingTag?: Types.Basic.HeadingTag;
  headingText?: React.ReactNode;
  image?: Types.Asset.Image;
  linkText?: React.ReactNode;
  linkUrl?: Types.Basic.Link;
  linkVisibility?: Types.Visibility.VisibilityConditions;
  paragraphText?: Types.Basic.RichTextChildren;
  /** Set to "listitem" if used in a list*/
  role?: string;
  style?: string;
  variant?: "Default" | "Cover" | "Stacked";
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
