"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";

export function StrokePath({
  as: _Component = DOM,
  path = "M18 24.8437L31 12.8438L18 0.843749",
}) {
  return (
    <_Component
      className={_utils.cx(_styles, "u-path")}
      d={path}
      slot=""
      tag="path"
    />
  );
}
