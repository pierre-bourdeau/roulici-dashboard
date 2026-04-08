"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";
import Image from "./_Builtin/Image";

export function VisualImage({
  as: _Component = DOM,
  altText = "__wf_reserved_inherit",
  attributeName = "",
  attributeValue = "",
  classes = " ",
  image = "",
  loading = "lazy",
  style = "",
  variant = "Wide 16 / 9",
  visibility = true,
}) {
  const _styleVariantMap = {
    "Wide 2 / 1": "",
    "Wide 16 / 9": "w-variant-27d05669-180c-3169-9b64-0eda31f8d4d3",
    "Wide 3 / 2": "w-variant-57c7d8f5-d942-5de8-0712-e12fff699502",
    "Wide 5 / 4": "w-variant-8e41429f-9f9e-7697-357e-815bd3e59383",
    "Square 1 / 1": "w-variant-a5f35569-5171-ee3d-f7bb-c5b2372249ac",
    "Tall 4 / 5": "w-variant-35ea7d22-774e-1ba9-1dcc-8a392636f83d",
    "Tall 2 / 3": "w-variant-a93327ec-aace-62d3-860b-21ee12acd25a",
    Cover: "w-variant-4972adff-107c-1f37-d19c-526a2bf55c28",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "u-image-wrapper", _activeStyleVariant)}
      slot=""
      style={style}
      tag="div"
    >
      <Image
        className={_utils.cx(_styles, "u-image", _activeStyleVariant)}
        height="auto"
        loading={loading}
        src={image}
        width="auto"
      />
    </_Component>
  ) : null;
}
