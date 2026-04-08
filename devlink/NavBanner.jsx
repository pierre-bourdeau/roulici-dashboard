"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import Block from "./_Builtin/Block";
import DOM from "./_Builtin/DOM";
import Link from "./_Builtin/Link";

export function NavBanner({
  as: _Component = Block,

  link = {
    href: "#",
  },

  text = "Important Update Banner",
  visibility = true,
}) {
  return visibility ? (
    <_Component
      aria-label="Announcement"
      className={_utils.cx(_styles, "nav_banner_wrap")}
      role="region"
      tag="div"
    >
      <Block className={_utils.cx(_styles, "nav_banner_contain")} tag="div">
        <Link
          block="inline"
          button={false}
          className={_utils.cx(_styles, "nav_banner_link")}
          data-state="external"
          options={link}
        >
          <Block
            className={_utils.cx(_styles, "nav_banner_text", "u-line-clamp-1")}
            tag="div"
          >
            {text}
          </Block>
          <DOM
            aria-hidden="true"
            className={_utils.cx(_styles, "nav_banner_svg")}
            fill="none"
            slot=""
            tag="svg"
            viewBox="0 0 27 24"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <DOM
              d="M0 12L24 12"
              slot=""
              stroke="currentColor"
              stroke-width="var(--nav--icon-thickness)"
              tag="path"
              vector-effect="non-scaling-stroke"
            />
            <DOM
              d="M14 1.5L24.5 12L14 22.5"
              slot=""
              stroke="currentColor"
              stroke-width="var(--nav--icon-thickness)"
              tag="path"
              vector-effect="non-scaling-stroke"
            />
          </DOM>
        </Link>
        <DOM
          className={_utils.cx(_styles, "nav_banner_close_wrap")}
          role="button"
          slot=""
          tag="button"
        >
          <DOM
            aria-hidden="true"
            className={_utils.cx(_styles, "nav_banner_close_svg")}
            fill="none"
            slot=""
            tag="svg"
            viewBox="0 0 20 19"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <DOM
              d="M1.51471 1.01465L18.4853 17.9852"
              slot=""
              stroke="currentColor"
              stroke-width="var(--nav--icon-thickness)"
              tag="path"
              vector-effect="non-scaling-stroke"
            />
            <DOM
              d="M1.51471 17.9851L18.4853 1.01454"
              slot=""
              stroke="currentColor"
              stroke-width="var(--nav--icon-thickness)"
              tag="path"
              vector-effect="non-scaling-stroke"
            />
          </DOM>
          <DOM
            className={_utils.cx(_styles, "nav_screen-reader-text")}
            slot=""
            tag="span"
          >
            {"Close Announcement Banner"}
          </DOM>
        </DOM>
      </Block>
    </_Component>
  ) : null;
}
