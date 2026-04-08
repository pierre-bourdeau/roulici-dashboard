"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";

export function Layout({
  as: _Component = DOM,
  classes = "",
  column1,
  column1Classes = " ",
  column2,
  column2Classes = " ",
  variant = "Stack",
  visibility = true,
}) {
  const _styleVariantMap = {
    Stack: "",
    "Stack Centered": "w-variant-d69d5003-e9bc-b347-4e02-eb46976beb1c",
    "Auto Width": "w-variant-1b1d171f-31c6-739b-bff9-2d7efa9674c4",
    Columns: "w-variant-558793eb-2b07-490b-9842-2d7e6f6bf325",
    "Columns Reversed": "w-variant-1261a7e4-2c05-3b0b-2126-d399890906b8",
    "Sticky Left": "w-variant-81232c92-6578-ef9a-1e3e-35e3204ae0fd",
    Breakout: "w-variant-4fee4cc0-701f-2817-944f-2c0261b9c2f3",
    "Breakout Reversed": "w-variant-6bb5e515-55a9-1fc8-d29b-ff898d8b40f7",
    Full: "w-variant-58b19052-6f23-ab5e-5e89-54288af57e85",
    "Full Reversed": "w-variant-560ed4d9-9e8c-5c39-4619-fc154cdf9f19",
    Contain: "w-variant-31f8ed75-2c88-945a-a737-1b9b50b4494b",
    "Contain Reversed": "w-variant-329f6899-ba0f-e4db-0449-3c5b8ba4f388",
    Card: "w-variant-ebfcdcb1-ac53-1b15-fcb9-eaeda25808f5",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "u-layout-wrapper", _activeStyleVariant)}
      slot=""
      tag="div"
    >
      <DOM
        className={_utils.cx(_styles, "u-layout", _activeStyleVariant)}
        slot=""
        tag="div"
      >
        {column1}
        {column2}
      </DOM>
    </_Component>
  ) : null;
}
