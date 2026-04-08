"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";

export function ContentWrapper({
  as: _Component = DOM,
  classes = " ",
  content,
  style = "",
  variant = "Left",
  visibility = true,
}) {
  const _styleVariantMap = {
    Inherit: "",
    Left: "w-variant-e85a4315-14bc-e5ef-0d3e-2c8c9ed7d2f1",
    Center: "w-variant-4f54624e-ceb1-0769-a238-365d5e220b70",
    Right: "w-variant-405b6754-709a-81de-bf32-f0102c0c7aa2",
    "Center Mobile": "w-variant-e98b91c1-a8bf-9b6d-a119-f398c9e3f46b",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "u-content-wrapper", _activeStyleVariant)}
      slot=""
      style={style}
      tag="div"
    >
      {content}
    </_Component>
  ) : null;
}
