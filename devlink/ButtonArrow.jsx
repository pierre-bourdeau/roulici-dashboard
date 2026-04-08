"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import Block from "./_Builtin/Block";
import DOM from "./_Builtin/DOM";
import { Clickable } from "./Clickable";
import { IconArrowFull } from "./IconArrowFull";

export function ButtonArrow({
  as: _Component = DOM,
  arrowDirection = "Primary / Medium",
  attributeName = "",
  attributeValue = "",
  classes = "",

  link = {
    href: "#",
  },

  text = "Next",
  variant = "Primary / Medium",
  visibility = true,
}) {
  const _styleVariantMap = {
    "Primary / Medium": "",
    "Secondary / Medium": "w-variant-bb0688d1-65b6-14b6-81e5-21e2cd39bbda",
    "Primary / Large": "w-variant-d7d7e32c-ac47-de0c-eb2d-07f19dfa19d2",
    "Secondary / Large": "w-variant-6c75cae2-0734-1bbf-191f-bfe0f8ed1797",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "button_arrow_wrap", _activeStyleVariant)}
      data-button=" "
      data-trigger="hover focus"
      slot=""
      tag="div"
    >
      <Block
        className={_utils.cx(
          _styles,
          "button_arrow_element",
          _activeStyleVariant
        )}
        tag="div"
      >
        <Block
          aria-hidden="true"
          className={_utils.cx(
            _styles,
            "button_arrow_icon",
            _activeStyleVariant
          )}
          tag="div"
        >
          <IconArrowFull variant={arrowDirection} />
        </Block>
      </Block>
      <Clickable link={link} screenReaderText={text} />
    </_Component>
  ) : null;
}
