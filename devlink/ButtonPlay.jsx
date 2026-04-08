"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import Block from "./_Builtin/Block";
import DOM from "./_Builtin/DOM";
import { Clickable } from "./Clickable";

export function ButtonPlay({
  as: _Component = DOM,
  attributeName = "",
  attributeValue = "",
  classes = " ",

  link = {
    href: "#",
  },

  text = "Play",
  variant = "Primary / Medium",
  visibility = true,
}) {
  const _styleVariantMap = {
    "Primary / Medium": "",
    "Secondary / Medium": "w-variant-ab355ea0-b722-2f23-3507-f0290f710e57",
    "Primary / Large": "w-variant-d47b6b31-1410-4123-4cbe-47472b6d649d",
    "Secondary / Large": "w-variant-3970b3f9-2fa6-52d8-098a-2260caaa12bb",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "button_toggle_wrap", _activeStyleVariant)}
      data-button=" "
      data-state="pressed"
      data-trigger="hover focus"
      slot=""
      tag="div"
    >
      <Block
        className={_utils.cx(
          _styles,
          "button_toggle_element",
          _activeStyleVariant
        )}
        tag="div"
      >
        <Block
          aria-hidden="true"
          className={_utils.cx(
            _styles,
            "button_toggle_icon",
            _activeStyleVariant
          )}
          tag="div"
        >
          <DOM
            className={_utils.cx(
              _styles,
              "button_toggle_play",
              "u-cover-absolute",
              _activeStyleVariant
            )}
            fill="none"
            slot=""
            tag="svg"
            viewBox="0 0 1393 1394"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <DOM
              d="M1271 696.5L280 1393L280 -4.3318e-05L1271 696.5Z"
              fill="currentColor"
              slot=""
              tag="path"
            />
          </DOM>
          <DOM
            className={_utils.cx(
              _styles,
              "button_toggle_pause",
              "u-cover-absolute",
              _activeStyleVariant
            )}
            fill="none"
            slot=""
            tag="svg"
            viewBox="0 0 898 1277"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <DOM
              fill="currentColor"
              height="1277"
              slot=""
              tag="rect"
              width="321"
              x="577"
            />
            <DOM
              fill="currentColor"
              height="1277"
              slot=""
              tag="rect"
              width="321"
            />
          </DOM>
        </Block>
      </Block>
      <Clickable link={link} screenReaderText={text} />
    </_Component>
  ) : null;
}
