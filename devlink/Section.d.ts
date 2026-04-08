import * as React from "react";
import * as Types from "./types";

declare function Section(props: {
  as?: React.ElementType;
  attributeName?: string;
  attributeValue?: string;
  background?: React.ReactNode;
  container?: React.ReactNode;
  containerClasses?: string;
  /** Type "id" in this field when applying an id to the section*/
  idAttributeName?: string;
  idAttributeValue?: Types.Basic.IdTextInput;
  paddingBottom?: "None" | "Even" | "Small" | "Main" | "Large" | "Page Top";
  paddingTop?: "None" | "Even" | "Small" | "Main" | "Large" | "Page Top";
  sectionClasses?: string;
  style?: string;
  tag?: Types.Basic.TagType;
  variant?: "Inherit" | "Light" | "Dark" | "Brand";
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
