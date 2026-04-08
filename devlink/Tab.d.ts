import * as React from "react";
import * as Types from "./types";

declare function Tab(props: {
  as?: React.ElementType;
  /** Set a duration in seconds such as "4" to make the tabs autoplay.*/
  autoplayDuration?: string;
  classes?: string;
  /** Give the component a unique ID to anchor link to it from a separate page.*/
  componentId?: string;
  /** Show next and previous buttons*/
  controlsVisibility?: Types.Visibility.VisibilityConditions;
  heading?: React.ReactNode;
  /** If true, the next button will loop instead of disabling when reaching end of list.*/
  loopControls?: Types.Boolean.Boolean;
  /** If set to true, the autoplay will pause whenever we hover over the component.*/
  pauseOnHover?: Types.Boolean.Boolean;
  /** Set to true to preview all tab content in designer view.*/
  previewContent?: Types.Boolean.Boolean;
  /** If set to true, tab content will slide from side to side instead of fading out.*/
  slideTabs?: Types.Boolean.Boolean;
  tabContent?: React.ReactNode;
  tabLink?: React.ReactNode;
  transitionDuration?: number;
  variant?: "Base" | "Horizontal";
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
