"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import Block from "./_Builtin/Block";
import DOM from "./_Builtin/DOM";
import RichText from "./_Builtin/RichText";

export function TypographyEyebrow({
  as: _Component = DOM,
  classes = " ",
  text = "",
  visibility = true,
}) {
  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "u-eyebrow-wrapper")}
      slot=""
      tag="div"
    >
      <Block className={_utils.cx(_styles, "u-eyebrow-layout")} tag="div">
        <Block className={_utils.cx(_styles, "u-eyebrow-marker")} tag="div" />
        <RichText
          className={_utils.cx(_styles, "u-eyebrow-text", "u-text-style-main")}
          slot=""
          tag="div"
        >
          {text}
        </RichText>
      </Block>
    </_Component>
  ) : null;
}
