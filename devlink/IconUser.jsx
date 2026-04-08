"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";

export function IconUser({ as: _Component = DOM }) {
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
        d="M10.75 4.5C10.6275 6.15219 9.37503 7.5 8.00003 7.5C6.62503 7.5 5.37034 6.1525 5.25003 4.5C5.12503 2.78125 6.34378 1.5 8.00003 1.5C9.65628 1.5 10.875 2.8125 10.75 4.5Z"
        slot=""
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        tag="path"
      />
      <DOM
        d="M8.00008 9.5C5.28133 9.5 2.52195 11 2.01133 13.8313C1.94976 14.1725 2.14289 14.5 2.50008 14.5H13.5001C13.8576 14.5 14.0507 14.1725 13.9891 13.8313C13.4782 11 10.7188 9.5 8.00008 9.5Z"
        slot=""
        stroke="currentColor"
        stroke-miterlimit="10"
        tag="path"
      />
    </_Component>
  );
}
