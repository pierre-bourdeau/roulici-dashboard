"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";

export function IconClose({ as: _Component = DOM }) {
  return (
    <_Component
      className={_utils.cx(_styles, "u-svg")}
      fill="none"
      slot=""
      tag="svg"
      viewBox="0 0 16 16"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <DOM
        d="M11.5 11.5L4.5 4.5"
        slot=""
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        tag="path"
      />
      <DOM
        d="M11.5 4.5L4.5 11.5"
        slot=""
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        tag="path"
      />
    </_Component>
  );
}
