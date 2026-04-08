import * as React from "react";
import * as Types from "./types";

declare function AccordionItem(props: {
  as?: React.ElementType;
  classes?: string;
  content?: Types.Basic.RichTextChildren;
  headingTag?: Types.Basic.TagType;
  headingText?: React.ReactNode;
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
