"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";
import { formatNumber } from "./values/Builtin/formatNumber";

export function TypographyPlain({
  as: _Component = DOM,
  classes = " ",
  maxWidth = -1,
  style = "",
  tag = "p",
  text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  variant = "Inherit",
  visibility = true,
}) {
  const _styleVariantMap = {
    Inherit: "",
    "Text Small": "w-variant-fe6f474d-1651-566b-eeff-3c86e8cbf153",
    "Text Main": "w-variant-26cc9f23-e71c-deee-cd61-36dc24f35fae",
    "Text Large": "w-variant-c8b8ac88-1ac7-e9f6-41cc-82c548bf142d",
    H6: "w-variant-47e40b0d-02af-2673-f429-546cac42dc5a",
    H5: "w-variant-12e93187-f8ac-b1a1-2e50-59d85a6bf516",
    H4: "w-variant-f196774e-dbfd-d1b4-1196-b3e824fc5f7d",
    H3: "w-variant-7bfbf33b-fb56-d8df-e2d2-8fe65a7f2e44",
    H2: "w-variant-9af60b09-c3a1-8c2a-eb78-8e29460ca7a9",
    H1: "w-variant-83c598b0-8cc2-f955-1996-fcb8fb10bf70",
    Display: "w-variant-8ee37a78-065b-6879-973d-319c65e28313",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "u-text", _activeStyleVariant)}
      data-number={formatNumber(-1)(maxWidth)}
      slot=""
      style={style}
      tag={tag}
    >
      <DOM slot="" tag="span">
        {text}
      </DOM>
    </_Component>
  ) : null;
}
