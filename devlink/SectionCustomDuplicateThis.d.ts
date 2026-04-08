import * as React from "react";
import * as Types from "./types";

declare function SectionCustomDuplicateThis(props: {
  as?: React.ElementType;
  button1Link?: Types.Basic.Link;
  button1Text?: React.ReactNode;
  button2Link?: Types.Basic.Link;
  button2Text?: React.ReactNode;
  contentEyebrowText?: Types.Basic.RichTextChildren;
  contentHeadingText?: Types.Basic.RichTextChildren;
  contentParagraphText?: Types.Basic.RichTextChildren;
  imageFile?: Types.Asset.Image;
  imageLoading?: string;
  imageVisibility?: Types.Visibility.VisibilityConditions;
  sectionId?: Types.Basic.IdTextInput;
  sectionPaddingBottom?:
    | "None"
    | "Even"
    | "Small"
    | "Main"
    | "Large"
    | "Page Top";
  sectionPaddingTop?: "None" | "Even" | "Small" | "Main" | "Large" | "Page Top";
  sectionTheme?: "Inherit" | "Light" | "Dark" | "Brand";
  sectionVisibility?: Types.Visibility.VisibilityConditions;
  videoUrl?: string;
}): React.JSX.Element;
