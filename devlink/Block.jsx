"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";

export function Block({
  as: _Component = DOM,
  attributeName = "",
  attributeValue = "",
  classes = " ",
  content,
  style = "",
  tag = "div",
  visibility = true,
}) {
  return visibility ? (
    <_Component class={classes} slot="" style={style} tag={tag}>
      {content}
    </_Component>
  ) : null;
}
