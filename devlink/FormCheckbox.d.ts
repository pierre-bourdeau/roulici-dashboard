import * as React from "react";
import * as Types from "./types";

declare function FormCheckbox(props: {
  as?: React.ElementType;
  /** Add a space to make the field checked by default*/
  checked?: string;
  classes?: string;
  inputAttributeName?: string;
  inputAttributeValue?: string;
  /** Label text shown on page*/
  label?: React.ReactNode;
  labelAttributeName?: string;
  labelAttributeValue?: string;
  /** Field title for submission results*/
  name?: string;
  /** Add a space to make the field required*/
  required?: string;
  /** Switch to "listitem" if used in a list*/
  role?: string;
  variant?: "Checkbox" | "Radio" | "Toggle" | "Button";
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
