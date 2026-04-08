"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";
import { StrokePath } from "./StrokePath";

export function IconArrow({ as: _Component = DOM, direction = "Right" }) {
  const _styleVariantMap = {
    Right: "",
    Left: "w-variant-dc469724-71a3-14e1-b5d5-1294323411ce",
    Top: "w-variant-b18a0fcd-abb0-329e-47f4-79155dd8284a",
    Bottom: "w-variant-caa8b8e9-e8ec-6eb3-4526-30f19f7326f5",
  };

  const _activeStyleVariant = _styleVariantMap[direction];

  return (
    <_Component
      aria-hidden="true"
      className={_utils.cx(_styles, "u-svg", _activeStyleVariant)}
      fill="none"
      height="100%"
      slot=""
      tag="svg"
      viewBox="0 0 66 70"
      width="100%"
    >
      <StrokePath path="M17 2L50 34.9999L17 68" />
    </_Component>
  );
}
