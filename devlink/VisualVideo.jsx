"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";

export function VisualVideo({
  as: _Component = DOM,
  attributeName = "",
  attributeValue = "",
  autoplay = "autoplay",
  classes = " ",
  loop = "loop",
  muted = "muted",
  style = "",
  url = "https://timothyricks.us.getafile.online/background-video",
  variant = "Wide 16 / 9",
  visibility = true,
}) {
  const _styleVariantMap = {
    "Wide 2 / 1": "",
    "Wide 16 / 9": "w-variant-0b00a75a-35ba-66c2-fce0-21c117d62ce0",
    "Wide 3 / 2": "w-variant-a9490bed-5b56-7b46-8413-993d16d77e88",
    "Wide 5 / 4": "w-variant-8157ca33-45d5-df1a-bd25-894298c8e117",
    "Square 1 / 1": "w-variant-ec7f8a9f-99ac-b5a5-140b-730400a62670",
    "Tall 4 / 5": "w-variant-f3f45657-6a73-93f9-25db-a80af56ad72a",
    "Tall 2 / 3": "w-variant-c3ccbb6c-6fa7-1113-0f2e-08b77dffca68",
    Cover: "w-variant-db26956a-7929-76af-05b0-02971cbab2f4",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "u-video", _activeStyleVariant)}
      playsinline=" "
      slot=""
      src={url}
      style={style}
      tag="video"
    />
  ) : null;
}
