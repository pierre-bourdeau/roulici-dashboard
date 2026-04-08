"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import Block from "./_Builtin/Block";
import DOM from "./_Builtin/DOM";
import Heading from "./_Builtin/Heading";
import Image from "./_Builtin/Image";
import RichText from "./_Builtin/RichText";
import { Clickable } from "./Clickable";

export function CardPrimary({
  as: _Component = DOM,
  classes = "",
  contentClasses = " ",

  externalLink = {
    href: "#",
  },

  headingTag = "h3",
  headingText = "Lorem ipsum",
  image = "",
  linkText = "",

  linkUrl = {
    href: "#",
  },

  linkVisibility = true,
  paragraphText = "",
  role = "none",
  style = "",
  variant = "Default",
  visibility = true,
}) {
  const _styleVariantMap = {
    Default: "",
    Cover: "w-variant-51efa20c-c7be-48fe-973a-11367f19d622",
    Stacked: "w-variant-da648fa9-bbba-c8cb-e549-1d22cb8af97b",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "card_primary_wrap", _activeStyleVariant)}
      role={role}
      slot=""
      style={style}
      tag="div"
    >
      <Block
        className={_utils.cx(
          _styles,
          "card_primary_group",
          _activeStyleVariant
        )}
        data-trigger="hover-if-clickable focus"
        tag="div"
      >
        <Block
          className={_utils.cx(
            _styles,
            "card_primary_element",
            _activeStyleVariant
          )}
          tag="div"
        >
          <Block
            className={_utils.cx(
              _styles,
              "card_primary_visual",
              _activeStyleVariant
            )}
            tag="div"
          >
            <Image
              alt=""
              className={_utils.cx(
                _styles,
                "card_primary_image",
                _activeStyleVariant
              )}
              height="auto"
              loading="lazy"
              src={image}
              width="auto"
            />
          </Block>
          <Block
            className={_utils.cx(
              _styles,
              "card_primary_content",
              "u-margin-trim",
              _activeStyleVariant
            )}
            tag="div"
          >
            <Heading
              className={_utils.cx(
                _styles,
                "card_primary_title",
                "u-text-style-h4",
                _activeStyleVariant
              )}
              tag={headingTag}
            >
              {headingText}
            </Heading>
            <RichText
              className={_utils.cx(
                _styles,
                "card_primary_text",
                _activeStyleVariant
              )}
              slot=""
              tag="div"
            >
              {paragraphText}
            </RichText>
          </Block>
        </Block>
        <Clickable
          attributeName=""
          attributeValue=""
          externalLink={externalLink}
          link={linkUrl}
          screenReaderText={linkText}
          type="button"
          visibility={linkVisibility}
        />
      </Block>
    </_Component>
  ) : null;
}
