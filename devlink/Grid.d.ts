import * as React from "react";
import * as Types from "./types";

declare function Grid(props: {
  as?: React.ElementType;
  classes?: string;
  content?: React.ReactNode;
  /** Column count on large screens and autofit / autofill max column count*/
  largeScreen?: number;
  /** 0 will inherit from the previous screen size*/
  mediumScreen?: number;
  /** For autofit or autofill grids*/
  minimumColumnSize?: number;
  /** Switch to "list" if grid will contain a list of items*/
  role?: string;
  /** 0 will inherit from the previous screen size*/
  smallestScreen?: number;
  /** 0 will inherit from the previous screen size*/
  smallScreen?: number;
  style?: string;
  variant?: "Default" | "Self Contained" | "Autofit" | "Autofill";
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
