"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";

export function CheckUi({
  as: _Component = DOM,
  checked = "",
  inputAttributeName = "",
  inputAttributeValue = "",
  label = "I agree to the terms",
  labelAttributeName = "",
  labelAttributeValue = "",
  name = "Name",
  required = "",
  type = "checkbox",
  value = "Value",
  variant = "Checkbox",
}) {
  const _styleVariantMap = {
    Checkbox: "",
    Radio: "w-variant-c18f59b8-0331-9f8c-c106-08818710cc20",
    Toggle: "w-variant-05ff758a-80c8-4344-649b-149f87b62cc9",
    Button: "w-variant-e3978449-fef8-38a6-7f29-4e26ca4f8f53",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return (
    <_Component
      className={_utils.cx(_styles, "form_ui_label", _activeStyleVariant)}
      data-state="checked"
      role="listitem"
      slot=""
      tag="label"
    >
      <DOM
        checked={checked}
        className={_utils.cx(_styles, "form_ui_input", _activeStyleVariant)}
        name={name}
        required={required}
        slot=""
        tag="input"
        type={type}
        value={value}
      />
      <DOM
        className={_utils.cx(
          _styles,
          "form_ui_visual_wrap",
          _activeStyleVariant
        )}
        slot=""
        tag="span"
      >
        <DOM
          className={_utils.cx(
            _styles,
            "form_ui_visual_inner",
            _activeStyleVariant
          )}
          slot=""
          tag="span"
        >
          <DOM
            aria-hidden="true"
            className={_utils.cx(
              _styles,
              "form_ui_visual_icon",
              _activeStyleVariant
            )}
            fill="none"
            slot=""
            tag="svg"
            viewBox="0 0 11 8"
          >
            <DOM
              d="M1 4L4 7L10 1"
              slot=""
              stroke="currentColor"
              stroke-width="0.125rem"
              tag="path"
              vector-effect="non-scaling-stroke"
            />
          </DOM>
        </DOM>
      </DOM>
      <DOM
        className={_utils.cx(_styles, "form_ui_text", _activeStyleVariant)}
        slot=""
        tag="span"
      >
        {label}
      </DOM>
    </_Component>
  );
}
