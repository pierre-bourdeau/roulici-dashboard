import * as React from "react";
import * as Types from "./types";

declare function FormTextarea(props: {
  as?: React.ElementType;
  attributeName?: string;
  attributeValue?: string;
  classes?: string;
  /** Field label shown on page*/
  label?: React.ReactNode;
  labelVariant?: "Visible" | "Hidden" | "Bold";
  /** Field title for submission results*/
  name?: string;
  placeholder?: string;
  /** Add a space to make the field required*/
  required?: string;
  value?: string;
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
