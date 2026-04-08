import * as React from "react";
import * as Types from "./types";

declare function FormSelect(props: {
  as?: React.ElementType;
  /** Add a space to allow multi select*/
  allowMultiSelect?: string;
  attributeName?: string;
  attributeValue?: string;
  classes?: string;
  formSelectOption?: React.ReactNode;
  /** Field label shown on page*/
  label?: React.ReactNode;
  labelVariant?: "Visible" | "Hidden" | "Bold";
  /** Field title for submission results*/
  name?: string;
  /** Add a space to make the field required*/
  required?: string;
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
