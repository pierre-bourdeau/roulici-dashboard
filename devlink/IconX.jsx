"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";
import { StrokePath } from "./StrokePath";

export function IconX({ as: _Component = DOM }) {
  return (
    <_Component
      aria-hidden="true"
      className={_utils.cx(_styles, "u-svg")}
      fill="none"
      slot=""
      tag="svg"
      viewBox="0 0 26 26"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <StrokePath path="M2 2L24.6274 24.6274" />
      <StrokePath path="M2 25L24.6274 2.37258" />
    </_Component>
  );
}
