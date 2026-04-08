"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";
import { StrokePath } from "./StrokePath";

export function IconSearch({ as: _Component = DOM }) {
  return (
    <_Component
      aria-hidden="true"
      className={_utils.cx(_styles, "u-svg")}
      fill="none"
      slot=""
      tag="svg"
      viewBox="0 0 400 400"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <StrokePath path="M 326,171     A 155,155 0 1,1 16,171     A 155,155 0 1,1 326,171" />
      <StrokePath path="M280.602 280.602L388.602 388.602" />
    </_Component>
  );
}
