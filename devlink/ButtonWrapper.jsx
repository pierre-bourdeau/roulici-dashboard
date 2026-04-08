"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";

export function ButtonWrapper({
  as: _Component = DOM,
  classes = "",
  content,
  style = "",
  visibility = true,
}) {
  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "u-button-wrapper")}
      slot=""
      style={style}
      tag="div"
    >
      {content}
    </_Component>
  ) : null;
}
