"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";
import { CheckUi } from "./CheckUi";

export function FormRadio({
  as: _Component = DOM,
  checked = "",
  classes = "",
  groupName = "Group Name",
  inputAttributeName = "",
  inputAttributeValue = "",
  label = "Label",
  labelAttributeName = "",
  labelAttributeValue = "",
  required = "",
  role = "none",
  value = "Value",
  variant = null,
  visibility = true,
}) {
  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "form_ui_item")}
      data-state="checked"
      role={role}
      slot=""
      tag="div"
    >
      <CheckUi
        checked={checked}
        inputAttributeName={inputAttributeName}
        inputAttributeValue={inputAttributeValue}
        label={label}
        labelAttributeName={labelAttributeName}
        labelAttributeValue={labelAttributeValue}
        name={groupName}
        required={required}
        type="radio"
        value={value}
        variant={variant}
      />
    </_Component>
  ) : null;
}
