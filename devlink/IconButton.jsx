"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";
import { Clickable } from "./Clickable";

export function IconButton({
  as: _Component = DOM,
  attributeLabel = "",
  attributeValue = "",

  clickableLink = {
    href: "#",
  },

  clickableScreenReaderText = "",
  icon,
  visibility = true,
}) {
  return visibility ? (
    <_Component
      className={_utils.cx(_styles, "icon-btn_wrap")}
      slot=""
      tag="div"
    >
      {icon}
      <Clickable
        externalLink={clickableLink}
        link={clickableLink}
        screenReaderText={clickableScreenReaderText}
      />
    </_Component>
  ) : null;
}
