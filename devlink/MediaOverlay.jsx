"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";
import { formatNumber } from "./values/Builtin/formatNumber";

export function MediaOverlay({
  as: _Component = DOM,
  classes = " ",
  overlayStrength = 70,
  variant = "Base",
  visibility = true,
}) {
  const _styleVariantMap = {
    Base: "",
    Gradient: "w-variant-9653c0cc-21fc-fb82-1373-c98b1644e5a8",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "u-overlay", _activeStyleVariant)}
      data-number={formatNumber(-1)(overlayStrength)}
      slot=""
      tag="div"
    />
  ) : null;
}
