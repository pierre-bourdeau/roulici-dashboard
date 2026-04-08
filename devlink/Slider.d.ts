import * as React from "react";
import * as Types from "./types";

declare function Slider(props: {
  as?: React.ElementType;
  classes?: string;
  content?: React.ReactNode;
  settingsControlsVisibility?: Types.Visibility.VisibilityConditions;
  /** If set to false, slider will be swipeable but not draggable.*/
  settingsFollowFinger?: Types.Boolean.Boolean;
  /** If set to true, slides will not snap into place on release.*/
  settingsFreeMode?: Types.Boolean.Boolean;
  /** If set to false, the slider can't be controlled by the keyboard arrow keys.*/
  settingsMousewheel?: Types.Boolean.Boolean;
  /** If set to true, the slide will move into view when we click on it.*/
  settingsSlideToClickedSlide?: Types.Boolean.Boolean;
  settingsSpeed?: number;
  slidesPerView?: string;
  variant?: "Overflow Visible" | "Overflow Hidden" | "Crop Left";
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
