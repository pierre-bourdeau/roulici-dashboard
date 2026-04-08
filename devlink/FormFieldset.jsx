"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";
import HtmlEmbed from "./_Builtin/HtmlEmbed";
import { FormLabelText } from "./FormLabelText";

export function FormFieldset({
  as: _Component = DOM,
  attributeName = "",
  attributeValue = "",
  classes = " ",
  content,
  legendText = "Legend",
  legendVariant = "Flex Vertical",
  slotRole = "none",
  variant = "Flex Vertical",
  visibility = true,
}) {
  const _styleVariantMap = {
    "Flex Vertical": "",
    "Flex Horizontal": "w-variant-ccbf2df7-16d0-30d7-0afb-0df098785596",
    "Grid 2 Column": "w-variant-14c165fa-7397-02ef-8dc0-6e307b6c980f",
    "Grid 3 Column": "w-variant-5fdb0361-c340-58a0-00d3-b0e0b17257ad",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "form_fieldset_wrap", _activeStyleVariant)}
      slot=""
      tag="fieldset"
    >
      <FormLabelText tag="legend" text={legendText} variant={legendVariant} />
      {content}
      <HtmlEmbed
        className={_utils.cx(_styles, "u-embed-css", _activeStyleVariant)}
        content=""
        value="%3Cstyle%3E%0A%40container%20(width%20%3C%2040em)%20%7B%0A%09.form_fieldset_list%3Ahas(.form_fieldset_list)%20%7B%20display%3A%20flex%3B%20%7D%0A%7D%0A%40container%20(width%20%3C%2018em)%20%7B%0A%09.form_fieldset_list%20%7B%20display%3A%20flex%3B%20%7D%0A%7D%0A%3C%2Fstyle%3E"
      />
    </_Component>
  ) : null;
}
