import * as React from "react";
import * as Types from "./types";

declare function FormRadio(props: {
  as?: React.ElementType;
  /** Add a space to make the field checked by default*/
  checked?: string;
  classes?: string;
  /** All radios within the same group should use the same group name*/
  groupName?: string;
  inputAttributeName?: string;
  inputAttributeValue?: string;
  /** Label text shown on page*/
  label?: React.ReactNode;
  labelAttributeName?: string;
  labelAttributeValue?: string;
  /** Add a space to make the field required*/
  required?: string;
  /** Switch to "listitem" if used in a list*/
  role?: string;
  /** Field value when checked*/
  value?: string;
  variant?: "Checkbox" | "Radio" | "Toggle" | "Button";
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
