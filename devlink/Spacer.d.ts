import * as React from "react";
import * as Types from "./types";

declare function Spacer(props: {
  as?: React.ElementType;
  variant?: "None" | "Even" | "Small" | "Main" | "Large" | "Page Top";
  visibility?: Types.Boolean.Boolean;
}): React.JSX.Element;
