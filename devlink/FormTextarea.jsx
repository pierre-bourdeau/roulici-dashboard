"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";
import { FormLabelText } from "./FormLabelText";

export function FormTextarea({
  as: _Component = DOM,
  attributeName = "",
  attributeValue = "",
  classes = "",
  label = "Label",
  labelVariant = null,
  name = "Name",
  placeholder = "",
  required = "",
  value = "",
  visibility = true,
}) {
  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "form_label_wrap")}
      data-trigger="focus"
      slot=""
      tag="label"
    >
      <FormLabelText text={label} variant={labelVariant} />
      <DOM
        className={_utils.cx(_styles, "form_field", "is-textarea")}
        name={name}
        placeholder={placeholder}
        required={required}
        slot=""
        tag="textarea"
        value={value}
      />
    </_Component>
  ) : null;
}
