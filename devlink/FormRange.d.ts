import * as React from "react";
import * as Types from "./types";

declare function FormRange(props: {
  as?: React.ElementType;
  attributeName?: string;
  attributeValue?: string;
  classes?: string;
  id?: string;
  label?: React.ReactNode;
  labelVariant?: "Visible" | "Hidden" | "Bold";
  max?: number;
  min?: number;
  /** Field title for submission results*/
  name?: string;
  outputUnit?: React.ReactNode;
  /** Add a space to make the field required*/
  required?: string;
  step?: number;
  value?: number;
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
