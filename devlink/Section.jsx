"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";
import { Spacer } from "./Spacer";

export function Section({
  as: _Component = DOM,
  attributeName = "",
  attributeValue = "",
  background,
  container,
  containerClasses = " ",
  idAttributeName = "",
  idAttributeValue = "",
  paddingBottom = null,
  paddingTop = null,
  sectionClasses = "",
  style = "",
  tag = "section",
  variant = "Inherit",
  visibility = true,
}) {
  const _styleVariantMap = {
    Inherit: "",
    Light: "w-variant-a4eabb01-8ed6-63d0-157e-0a7b56aedaa1",
    Dark: "w-variant-857e5430-97c7-deb6-3c1a-d3063f9fe2c7",
    Brand: "w-variant-25bf08d9-3196-322b-5616-019ac7f0f4f7",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      class={sectionClasses}
      className={_utils.cx(_styles, "u-section", _activeStyleVariant)}
      slot=""
      style={style}
      tag={tag}
    >
      {background}
      <Spacer variant={paddingTop} />
      {container}
      <Spacer variant={paddingBottom} />
    </_Component>
  ) : null;
}
