"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";

export function TabLink({
  as: _Component = DOM,
  classes = "",
  itemId = "",
  text = "Tab Link",
  variant = "Link",
  visibility = true,
}) {
  const _styleVariantMap = {
    Link: "",
    Button: "w-variant-8ffc88d1-7ba2-15f6-9b67-306f6d86c1bd",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "tab_button_item", _activeStyleVariant)}
      data-tab-item-id={itemId}
      slot=""
      tag="button"
    >
      <DOM
        className={_utils.cx(
          _styles,
          "tab_button_text",
          "u-text-style-main",
          _activeStyleVariant
        )}
        slot=""
        tag="span"
      >
        {text}
      </DOM>
      <DOM
        className={_utils.cx(_styles, "tab_button_line", _activeStyleVariant)}
        slot=""
        tag="span"
      />
    </_Component>
  ) : null;
}
