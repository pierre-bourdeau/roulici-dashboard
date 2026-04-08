"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import Block from "./_Builtin/Block";
import Heading from "./_Builtin/Heading";

export function FooterGroup({
  as: _Component = Block,
  footerLink,
  title = "Heading Text",
  visibility = true,
}) {
  return visibility ? (
    <_Component
      className={_utils.cx(_styles, "footer_group_wrap")}
      data-trigger="group"
      tag="section"
    >
      <Heading
        className={_utils.cx(
          _styles,
          "footer_group_title",
          "u-text-style-h6",
          "u-margin-bottom-text"
        )}
        tag="h3"
      >
        {title}
      </Heading>
      {footerLink}
    </_Component>
  ) : null;
}
