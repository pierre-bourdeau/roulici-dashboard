"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import Block from "./_Builtin/Block";
import DOM from "./_Builtin/DOM";
import { Clickable } from "./Clickable";
import { IconX } from "./IconX";

export function ButtonClose({
  as: _Component = DOM,
  attribute1Name = "",
  attribute1Value = "",
  attribute2Name = "",
  attribute2Value = "",
  classes = "",

  link = {
    href: "#",
  },

  text = "Close",
  variant = "Primary / Medium",
  visibility = true,
}) {
  const _styleVariantMap = {
    "Primary / Medium": "",
    "Secondary / Medium": "w-variant-c144d67f-2c62-4dbf-0fd8-0b6056b717ec",
    "Primary / Large": "w-variant-7198e0ca-f9f4-9662-3fe9-d7114404c9cb",
    "Secondary / Large": "w-variant-c6d40e5e-3298-1af4-067d-37896ebd2a45",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "button_close_wrap", _activeStyleVariant)}
      data-button=" "
      data-trigger="hover focus"
      slot=""
      tag="div"
    >
      <Block
        className={_utils.cx(
          _styles,
          "button_close_element",
          _activeStyleVariant
        )}
        tag="div"
      >
        <Block
          aria-hidden="true"
          className={_utils.cx(
            _styles,
            "button_close_icon",
            _activeStyleVariant
          )}
          tag="div"
        >
          <IconX />
        </Block>
      </Block>
      <Clickable link={link} screenReaderText={text} />
    </_Component>
  ) : null;
}
