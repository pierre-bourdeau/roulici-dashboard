import * as React from "react";
import * as Types from "./types";

declare function Header(props: {
  as?: React.ElementType;
  buttonMainAttributeName?: string;
  buttonMainAttributeValue?: string;
  buttonMainClasses?: string;
  buttonMainClickableVisibility?: Types.Visibility.VisibilityConditions;
  buttonMainExternalLink?: Types.Basic.Link;
  buttonMainLink?: Types.Basic.Link;
  buttonMainText?: React.ReactNode;
  /** button, submit, reset*/
  buttonMainType?: string;
  buttonMainVariant?: "Primary" | "Secondary" | "Link";
  buttonMainVisibility?: Types.Visibility.VisibilityConditions;
  iconButtonVisibility?: Types.Boolean.Boolean;
  link?: Types.Basic.Link;
  text1?: React.ReactNode;
  text2?: React.ReactNode;
  text3?: React.ReactNode;
  text4?: React.ReactNode;
  text5?: React.ReactNode;
  text6?: React.ReactNode;
  text7?: React.ReactNode;
  text8?: React.ReactNode;
}): React.JSX.Element;
