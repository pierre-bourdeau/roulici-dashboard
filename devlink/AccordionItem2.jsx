"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import Block from "./_Builtin/Block";
import DOM from "./_Builtin/DOM";
import Heading from "./_Builtin/Heading";
import RichText from "./_Builtin/RichText";

export function AccordionItem2({
  as: _Component = DOM,
  answer = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  answers = "",
  question = "This is just a simple CSS Accordion",
}) {
  return (
    <_Component
      className={_utils.cx(_styles, "faq-hero_accordion_item_wrap")}
      data-accordion-status="not-active"
      slot=""
      tag="li"
    >
      <Block
        className={_utils.cx(_styles, "faq-hero_accordion_item_top")}
        data-accordion-toggle=""
        data-hover=""
        tag="div"
      >
        <Heading
          className={_utils.cx(
            _styles,
            "faq-hero_accordion_item_title",
            "u-text-style-h6"
          )}
          tag="h2"
        >
          {question}
        </Heading>
        <Block
          className={_utils.cx(_styles, "faq-hero_accordion_item_icon")}
          tag="div"
        >
          <DOM
            className={_utils.cx(_styles, "faq-hero_accordion_item_icon_svg")}
            fill="none"
            slot=""
            tag="svg"
            viewBox="0 0 36 36"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <DOM
              d="M28.5 22.5L18 12L7.5 22.5"
              slot=""
              stroke="currentColor"
              stroke-miterlimit="10"
              stroke-width="3"
              tag="path"
            />
          </DOM>
        </Block>
      </Block>
      <Block
        className={_utils.cx(_styles, "faq-hero_accordion_item_bottom")}
        tag="div"
      >
        <Block
          className={_utils.cx(_styles, "faq-hero_accordion_item_container")}
          tag="div"
        >
          <Block
            className={_utils.cx(_styles, "faq-hero_accordion_item_content")}
            tag="div"
          >
            <RichText
              className={_utils.cx(
                _styles,
                "faq-hero_accordion_item_p",
                "u-rich-text"
              )}
              slot=""
              tag="div"
            >
              {answers}
            </RichText>
          </Block>
        </Block>
      </Block>
    </_Component>
  );
}
