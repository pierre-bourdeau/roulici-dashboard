"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import HtmlEmbed from "./_Builtin/HtmlEmbed";

export function StarterCss({ as: _Component = HtmlEmbed }) {
  return (
    <_Component
      className={_utils.cx(_styles, "u-embed-css")}
      content=""
      value="%3Cstyle%3E%0A%0A%3C%2Fstyle%3E"
    />
  );
}
