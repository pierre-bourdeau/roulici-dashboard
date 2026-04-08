"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";

export function IconGlobe({ as: _Component = DOM }) {
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
        d="M8 1.5C4.41031 1.5 1.5 4.41031 1.5 8C1.5 11.5897 4.41031 14.5 8 14.5C11.5897 14.5 14.5 11.5897 14.5 8C14.5 4.41031 11.5897 1.5 8 1.5Z"
        slot=""
        stroke="currentColor"
        stroke-miterlimit="10"
        tag="path"
      />
      <DOM
        d="M7.99994 1.5C6.18525 1.5 4.479 4.41031 4.479 8C4.479 11.5897 6.18525 14.5 7.99994 14.5C9.81463 14.5 11.5209 11.5897 11.5209 8C11.5209 4.41031 9.81463 1.5 7.99994 1.5Z"
        slot=""
        stroke="currentColor"
        stroke-miterlimit="10"
        tag="path"
      />
      <DOM
        d="M3.6665 3.66656C4.8615 4.515 6.36588 5.02094 7.99994 5.02094C9.634 5.02094 11.1384 4.515 12.3334 3.66656"
        slot=""
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        tag="path"
      />
      <DOM
        d="M12.3334 12.3334C11.1384 11.485 9.634 10.9791 7.99994 10.9791C6.36588 10.9791 4.8615 11.485 3.6665 12.3334"
        slot=""
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        tag="path"
      />
      <DOM
        d="M8 1.5V14.5"
        slot=""
        stroke="currentColor"
        stroke-miterlimit="10"
        tag="path"
      />
      <DOM
        d="M14.5 8H1.5"
        slot=""
        stroke="currentColor"
        stroke-miterlimit="10"
        tag="path"
      />
    </_Component>
  );
}
