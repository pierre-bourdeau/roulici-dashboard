"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";
import Link from "./_Builtin/Link";

export function Clickable({
  as: _Component = DOM,
  attributeName = "",
  attributeValue = "",

  externalLink = {
    href: "#",
  },

  link = {
    href: "#",
  },

  screenReaderText = "",
  type = "button",
  variant = "Focus Ring Outside",
  visibility = true,
}) {
  const _styleVariantMap = {
    "Focus Ring Outside": "",
    "Focus Ring Inside": "w-variant-b793638f-e9bb-2cea-c2d9-27bf5a1f754a",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      class="u-cover-absolute"
      className={_utils.cx(_styles, "clickable_wrap", _activeStyleVariant)}
      slot=""
      tag="div"
    >
      <Link
        aria-label={null}
        block="inline"
        button={false}
        className={_utils.cx(_styles, "clickable_link", _activeStyleVariant)}
        options={link}
      />
      <Link
        aria-label={null}
        block="inline"
        button={false}
        className={_utils.cx(_styles, "clickable_link", _activeStyleVariant)}
        options={externalLink}
        target="_blank"
      />
      <DOM
        aria-label={null}
        className={_utils.cx(_styles, "clickable_btn", _activeStyleVariant)}
        slot=""
        tag="button"
        type={type}
      />
    </_Component>
  ) : null;
}
