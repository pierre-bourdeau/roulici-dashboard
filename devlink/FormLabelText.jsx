"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";

export function FormLabelText({
  as: _Component = DOM,
  classes = "",
  tag = "span",
  text = "Name",
  variant = "Visible",
  visibility = true,
}) {
  const _styleVariantMap = {
    Visible: "",
    Hidden: "w-variant-46933b79-cf19-81b4-bc00-8af5c19b08b3",
    Bold: "w-variant-e8e97384-daa0-7ce7-bc12-14efcd69bcd4",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "form_label_text", _activeStyleVariant)}
      slot=""
      tag={tag}
    >
      {text}
    </_Component>
  ) : null;
}
