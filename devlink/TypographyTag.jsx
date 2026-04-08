"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";

export function TypographyTag({
  as: _Component = DOM,
  classes = "",
  text = "Text Block",
  visibility = true,
}) {
  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "tag_wrap")}
      slot=""
      tag="div"
    >
      {text}
    </_Component>
  ) : null;
}
