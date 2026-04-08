"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";
import { FormLabelText } from "./FormLabelText";

export function FormInput({
  as: _Component = DOM,
  attributeName = "",
  attributeValue = "",
  autoComplete = "",
  classes = "",
  inputMode = "text",
  label = "Label",
  labelVariant = null,
  name = "Field Name",
  placeholder = "Placeholder",
  required = "",
  type = "text",
  value = "",
  visibility = true,
}) {
  return visibility ? (
    <_Component
      className={_utils.cx(_styles, "form_label_wrap")}
      data-trigger="focus"
      slot=""
      tag="label"
    >
      <FormLabelText text={label} variant={labelVariant} />
      <DOM
        autocomplete={autoComplete}
        class={classes}
        className={_utils.cx(_styles, "form_field")}
        inputmode={inputMode}
        name={name}
        placeholder={placeholder}
        required={required}
        slot=""
        tag="input"
        type={type}
        value={value}
      />
    </_Component>
  ) : null;
}
