"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";
import { StrokePath } from "./StrokePath";

export function IconArrowFull({ as: _Component = DOM, variant = "Right" }) {
  const _styleVariantMap = {
    Right: "",
    Left: "w-variant-1c3f028b-116e-d4eb-db7f-8484491bbf2e",
    Top: "w-variant-a0a4b133-f837-5340-6c98-04b1518f150d",
    Bottom: "w-variant-5939aeba-b378-ecdc-f1bc-b6970df2be03",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return (
    <_Component
      aria-hidden="true"
      className={_utils.cx(_styles, "u-svg", _activeStyleVariant)}
      fill="none"
      slot=""
      tag="svg"
      viewBox="0 0 33 26"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <StrokePath />
      <StrokePath path="M30.5 13L0 13" />
    </_Component>
  );
}
