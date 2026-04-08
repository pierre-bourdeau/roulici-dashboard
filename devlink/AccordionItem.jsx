"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import Block from "./_Builtin/Block";
import DOM from "./_Builtin/DOM";
import RichText from "./_Builtin/RichText";
import { IconArrow } from "./IconArrow";

export function AccordionItem({
  as: _Component = Block,
  classes = "",
  content = "",
  headingTag = "h3",
  headingText = "This is some text inside of a div block.",
  visibility = true,
}) {
  return visibility ? (
    <_Component
      className={_utils.cx(_styles, "accordion_item")}
      data-state=""
      role="listitem"
      tag="div"
    >
      <Block className={_utils.cx(_styles, "accordion_component")} tag="div">
        <DOM
          className={_utils.cx(_styles, "accordion_toggle_heading")}
          slot=""
          tag={headingTag}
        >
          <DOM
            aria-expanded="false"
            className={_utils.cx(_styles, "accordion_toggle_button")}
            slot=""
            tag="button"
          >
            <DOM
              className={_utils.cx(
                _styles,
                "accordion_toggle_text",
                "u-text-style-h5"
              )}
              slot=""
              tag="span"
            >
              {headingText}
            </DOM>
            <DOM
              className={_utils.cx(_styles, "accordion_toggle_icon")}
              slot=""
              tag="span"
            >
              <IconArrow direction="Bottom" />
            </DOM>
          </DOM>
        </DOM>
        <Block
          className={_utils.cx(_styles, "accordion_content_wrap")}
          tag="div"
        >
          <Block
            className={_utils.cx(_styles, "accordion_content_padding")}
            tag="div"
          >
            <RichText
              className={_utils.cx(
                _styles,
                "accordion_content_text",
                "u-rich-text"
              )}
              slot=""
              tag="div"
            >
              {content}
            </RichText>
          </Block>
        </Block>
      </Block>
    </_Component>
  ) : null;
}
