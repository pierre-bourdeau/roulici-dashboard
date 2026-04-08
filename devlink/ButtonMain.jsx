"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import Block from "./_Builtin/Block";
import DOM from "./_Builtin/DOM";
import { Clickable } from "./Clickable";

export function ButtonMain({
  as: _Component = DOM,
  attributeName = "",
  attributeValue = "",
  classes = "",
  clickableVisibility = true,

  externalLink = {
    href: "#",
  },

  icon,

  link = {
    href: "#",
  },

  text = "Button Text",
  type = "button",
  variant = "Primary",
  visibility = true,
}) {
  const _styleVariantMap = {
    Primary: "",
    Secondary: "w-variant-e85564cd-af30-a478-692b-71732aefb3ab",
    Link: "w-variant-625d5df4-ad91-f7dc-9e2f-2e69f3fd7400",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "button_main_wrap", _activeStyleVariant)}
      data-button=" "
      data-trigger="hover focus"
      slot=""
      tag="div"
    >
      <Clickable
        externalLink={externalLink}
        link={link}
        screenReaderText={text}
        type={type}
        visibility={clickableVisibility}
      />
      <Block
        aria-hidden="true"
        className={_utils.cx(
          _styles,
          "button_main_text",
          "u-text-style-main",
          _activeStyleVariant
        )}
        tag="div"
      >
        {text}
      </Block>
      {icon}
      <Block
        className={_utils.cx(_styles, "button_main_line", _activeStyleVariant)}
        tag="div"
      />
    </_Component>
  ) : null;
}
