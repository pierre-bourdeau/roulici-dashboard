import * as React from "react";
import * as Types from "./types";

declare function Block(props: {
  as?: React.ElementType;
  attributeName?: string;
  attributeValue?: string;
  classes?: string;
  content?: React.ReactNode;
  style?: string;
  tag?: Types.Basic.TagType;
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
