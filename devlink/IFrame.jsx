"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";
import HtmlEmbed from "./_Builtin/HtmlEmbed";

export function IFrame({
  as: _Component = DOM,
  classes = "",
  style = "",
  title = "YouTube video player",
  url = "https://www.youtube.com/embed/GPRcAZLuT3U",
  visibility = true,
}) {
  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "u-iframe-wrapper")}
      slot=""
      style={style}
      tag="div"
    >
      <HtmlEmbed
        className={_utils.cx(_styles, "u-embed-css")}
        content=""
        value="%3Cstyle%3E%0Ahtml.site-scrollbar%20.c-iframe%20%7B%0A%09pointer-events%3A%20none%3B%0A%7D%0A%3C%2Fstyle%3E"
      />
      <DOM
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen=" "
        className={_utils.cx(_styles, "u-iframe")}
        frameborder="0"
        referrerpolicy="strict-origin-when-cross-origin"
        slot=""
        src={url}
        tag="iframe"
        title={title}
      />
    </_Component>
  ) : null;
}
