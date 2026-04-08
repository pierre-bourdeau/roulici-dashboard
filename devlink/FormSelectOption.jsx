"use client";
import React from "react";
import DOM from "./_Builtin/DOM";

export function FormSelectOption({
  as: _Component = DOM,
  hidden = "",
  selected = "",
  text = "Option 1",
  value = "Option 1",
  visibility = true,
}) {
  return visibility ? (
    <_Component
      hidden={hidden}
      selected={selected}
      slot=""
      tag="option"
      value={value}
    >
      {text}
    </_Component>
  ) : null;
}
