"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";
import { FormLabelText } from "./FormLabelText";

export function FormSelect({
  as: _Component = DOM,
  allowMultiSelect = "",
  attributeName = "",
  attributeValue = "",
  classes = "",
  formSelectOption,
  label = "Label",
  labelVariant = null,
  name = "Name",
  required = "",
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
        className={_utils.cx(_styles, "form_select_wrap")}
        slot=""
        tag="span"
      >
        <DOM
          className={_utils.cx(_styles, "form_field")}
          multiple={allowMultiSelect}
          name={name}
          required={required}
          slot=""
          tag="select"
        >
          {formSelectOption}
        </DOM>
        <DOM
          aria-hidden="true"
          className={_utils.cx(_styles, "form_select_icon")}
          fill="none"
          slot=""
          tag="svg"
          viewBox="0 0 6 5"
          width="100%"
        >
          <DOM
            d="M0.5 1L3 3.5L5.5 1"
            slot=""
            stroke="currentColor"
            stroke-width="0.125rem"
            tag="path"
            vector-effect="non-scaling-stroke"
          />
        </DOM>
      </DOM>
    </_Component>
  ) : null;
}
