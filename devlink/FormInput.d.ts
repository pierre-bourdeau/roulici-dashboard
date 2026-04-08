import * as React from "react";
import * as Types from "./types";

declare function FormInput(props: {
  as?: React.ElementType;
  attributeName?: string;
  attributeValue?: string;
  /** on, off, name, given-name, family-name, email, tel, organization-title, organization, street-address, address-line1, country, country-name, postal-code, gender, birthday, bday-year, language, photo, url, home, work, mobile*/
  autoComplete?: string;
  classes?: string;
  /** Touch device keyboard type: none, text, decimal, numeric, tel, search, email, url*/
  inputMode?: string;
  label?: React.ReactNode;
  labelVariant?: "Visible" | "Hidden" | "Bold";
  /** Field title for submission results*/
  name?: string;
  placeholder?: string;
  /** Add a space to make the field required*/
  required?: string;
  /** text, email, password, tel, url, search, number, date*/
  type?: string;
  value?: string;
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
