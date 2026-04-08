"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";
import { formatNumber } from "./values/Builtin/formatNumber";

export function Grid({
  as: _Component = DOM,
  classes = " ",
  content,
  largeScreen = 2,
  mediumScreen = 1,
  minimumColumnSize = 12,
  role = "none",
  smallestScreen = 0,
  smallScreen = 0,
  style = "",
  variant = "Default",
  visibility = true,
}) {
  const _styleVariantMap = {
    Default: "",
    "Self Contained": "w-variant-b8204f2e-764d-b421-dc96-2c59d3054271",
    Autofit: "w-variant-d58244bf-290f-ebb3-3aa0-352d6fa8e84f",
    Autofill: "w-variant-129319ac-a2cd-9e88-2ebd-a33b4bb85fa5",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "u-grid-wrapper", _activeStyleVariant)}
      data-number={formatNumber(-1)(minimumColumnSize)}
      slot=""
      style={style}
      tag="div"
    >
      {content}
    </_Component>
  ) : null;
}
