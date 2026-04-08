import * as React from "react";
import * as Types from "./types";

declare function CheckUi(props: {
  as?: React.ElementType;
  /** Add a space to make the field checked by default*/
  checked?: string;
  inputAttributeName?: string;
  inputAttributeValue?: string;
  /** Field label shown on page*/
  label?: React.ReactNode;
  labelAttributeName?: string;
  labelAttributeValue?: string;
  name?: string;
  /** Add a space to make the field required*/
  required?: string;
  type?: string;
  value?: string;
  variant?: "Checkbox" | "Radio" | "Toggle" | "Button";
}): React.JSX.Element;
