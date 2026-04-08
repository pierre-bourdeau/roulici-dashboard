"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import Block from "./_Builtin/Block";
import DOM from "./_Builtin/DOM";
import Link from "./_Builtin/Link";

export function FooterLink({
  as: _Component = DOM,

  link = {
    href: "#",
  },

  text = "Link Text Here",
  visibility = true,
}) {
  return visibility ? (
    <_Component
      className={_utils.cx(_styles, "footer_group_item")}
      data-trigger="hover-other focus-other"
      role="listitem"
      slot=""
      tag="div"
    >
      <Link
        block="inline"
        button={false}
        className={_utils.cx(_styles, "footer_link_wrap")}
        options={link}
      >
        <Block
          className={_utils.cx(
            _styles,
            "footer_link_text",
            "u-text-style-small"
          )}
          tag="div"
        >
          {text}
        </Block>
      </Link>
    </_Component>
  ) : null;
}
