import * as React from "react";
import * as Types from "./types";

declare function MediaOverlay(props: {
  as?: React.ElementType;
  classes?: string;
  overlayStrength?: number;
  variant?: "Base" | "Gradient";
  visibility?: Types.Visibility.VisibilityConditions;
}): React.JSX.Element;
