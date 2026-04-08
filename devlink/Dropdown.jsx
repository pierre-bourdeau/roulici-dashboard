"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import Block from "./_Builtin/Block";
import DOM from "./_Builtin/DOM";
import HtmlEmbed from "./_Builtin/HtmlEmbed";
import { IconArrow } from "./IconArrow";

export function Dropdown({
  as: _Component = Block,
  closeOnHoverOut = false,
  content,
  openOnHoverIn = false,
  preview = false,
  text = "Dropdown Text",
  visibility = true,
}) {
  return visibility ? (
    <_Component
      className={_utils.cx(_styles, "dropdown_wrap")}
      data-close-on-hover-out={null}
      data-open-on-hover-in={null}
      data-preview={null}
      tag="div"
    >
      <HtmlEmbed
        className={_utils.cx(_styles, "u-embed-css")}
        content=""
        value="%3Cstyle%3E%0A.wf-design-mode%20.dropdown_wrap%3Anot(%3Ahas(%3E%20%5Bdata-w-instance-of%5D))%20.dropdown_content%2C%0A.wf-design-mode%20.dropdown_wrap%5Bdata-preview%3D%22True%22%5D%20.dropdown_content%20%7B%0A%09display%3A%20block%3B%0A%7D%0A%3C%2Fstyle%3E"
      />
      <Block className={_utils.cx(_styles, "dropdown_toggle_wrap")} tag="div">
        <Block
          aria-hidden="true"
          className={_utils.cx(
            _styles,
            "dropdown_toggle_text",
            "u-text-style-main"
          )}
          tag="div"
        >
          {text}
        </Block>
        <Block
          className={_utils.cx(_styles, "dropdown_toggle_arrow")}
          tag="div"
        >
          <IconArrow direction="Bottom" />
        </Block>
        <DOM
          aria-expanded="false"
          aria-label={null}
          className={_utils.cx(_styles, "dropdown_toggle_clickable")}
          slot=""
          tag="button"
        />
      </Block>
      <Block className={_utils.cx(_styles, "dropdown_content")} tag="div">
        {content}
      </Block>
      <HtmlEmbed
        className={_utils.cx(_styles, "u-embed-js")}
        content=""
        value="%3Cscript%3E%0Adocument.addEventListener(%22DOMContentLoaded%22%2C%20function%20()%20%7B%0A%20%20document.querySelectorAll(%22.dropdown_wrap%22).forEach((component%2C%20index)%20%3D%3E%20%7B%0A%20%20%20%20if%20(component.dataset.scriptInitialized)%20return%3B%0A%20%20%20%20component.dataset.scriptInitialized%20%3D%20%22true%22%3B%0A%20%20%20%20const%20button%20%3D%20component.querySelector(%22.dropdown_toggle_clickable%22)%3B%0A%20%20%20%20const%20content%20%3D%20component.querySelector(%22.dropdown_content%22)%3B%0A%20%20%20%20const%20variant%20%3D%20component.getAttribute(%22data-wf--dropdown--variant%22)%3B%0A%20%20%20%20button.setAttribute(%22id%22%2C%20%60dropdown-btn-%24%7Bindex%7D%60)%3B%0A%20%20%20%20button.setAttribute(%22aria-controls%22%2C%20%60dropdown-%24%7Bindex%7D%60)%3B%0A%20%20%20%20content.setAttribute(%22id%22%2C%20%60dropdown-%24%7Bindex%7D%60)%3B%0A%20%20%20%20content.setAttribute(%22aria-labelledby%22%2C%20%60dropdown-btn-%24%7Bindex%7D%60)%3B%0A%20%20%20%20function%20openDropdown()%20%7B%0A%20%20%20%20%20%20button.setAttribute(%22aria-expanded%22%2C%20%22true%22)%3B%0A%20%20%20%20%20%20component.classList.add(%22is-active%22)%3B%0A%20%20%20%20%20%20let%20tl%20%3D%20gsap.timeline(%7B%20onComplete%3A%20()%20%3D%3E%20%7B%20if%20(typeof%20ScrollTrigger%20!%3D%3D%20%22undefined%22)%20ScrollTrigger.refresh()%20%7D%20%7D)%3B%0A%20%20%20%20%20%20tl.set(content%2C%20%7B%20display%3A%20%22block%22%20%7D)%3B%0A%20%20%20%20%20%20tl.fromTo(content%2C%20%7B%20height%3A%200%20%7D%2C%20%7B%20height%3A%20%22auto%22%2C%20ease%3A%20%22power1.inOut%22%2C%20duration%3A%200.4%20%7D)%3B%0A%20%20%20%20%7D%0A%20%20%20%20function%20closeDropdown()%20%7B%0A%20%20%20%20%20%20button.setAttribute(%22aria-expanded%22%2C%20%22false%22)%3B%0A%20%20%20%20%20%20component.classList.remove(%22is-active%22)%3B%0A%20%20%20%20%20%20let%20tl%20%3D%20gsap.timeline(%7B%20onComplete%3A%20()%20%3D%3E%20%7B%20if%20(typeof%20ScrollTrigger%20!%3D%3D%20%22undefined%22)%20ScrollTrigger.refresh()%20%7D%20%7D)%3B%0A%20%20%20%20%20%20tl.to(content%2C%20%7B%20height%3A%200%2C%20ease%3A%20%22power1.inOut%22%2C%20duration%3A%200.4%20%7D)%3B%0A%20%20%20%20%20%20tl.set(content%2C%20%7B%20display%3A%20%22none%22%20%7D)%3B%0A%20%20%20%20%7D%0A%20%20%20%20function%20isOpen()%20%7B%0A%20%20%20%20%20%20return%20button.getAttribute(%22aria-expanded%22)%20%3D%3D%3D%20%22true%22%3B%0A%20%20%20%20%7D%0A%20%20%20%20button.addEventListener(%22click%22%2C%20()%20%3D%3E%20%7B%0A%20%20%20%20%20%20isOpen()%20%3F%20closeDropdown()%20%3A%20openDropdown()%3B%0A%20%20%20%20%7D)%3B%0A%20%20%20%20document.addEventListener(%22keydown%22%2C%20function%20(e)%20%7B%0A%20%20%20%20%20%20if%20(e.key%20%3D%3D%3D%20%22Escape%22%20%26%26%20isOpen())%20%7B%0A%20%20%20%20%20%20%20%20closeDropdown()%3B%0A%20%20%20%20%20%20%20%20button.focus()%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20if%20((e.key%20%3D%3D%3D%20%22ArrowDown%22%20%7C%7C%20e.key%20%3D%3D%3D%20%22ArrowUp%22)%20%26%26%20isOpen()%20%26%26%20component.contains(document.activeElement))%20%7B%0A%20%20%20%20%20%20%20%20e.preventDefault()%3B%0A%20%20%20%20%20%20%20%20const%20items%20%3D%20%5B...content.querySelectorAll(%22a%2C%20button%22)%5D%3B%0A%20%20%20%20%20%20%20%20if%20(items.length%20%3D%3D%3D%200)%20return%3B%0A%20%20%20%20%20%20%20%20const%20currentIndex%20%3D%20items.indexOf(document.activeElement)%3B%0A%20%20%20%20%20%20%20%20let%20nextIndex%3B%0A%20%20%20%20%20%20%20%20if%20(currentIndex%20%3D%3D%3D%20-1)%20%7B%0A%20%20%20%20%20%20%20%20%20%20nextIndex%20%3D%20e.key%20%3D%3D%3D%20%22ArrowDown%22%20%3F%200%20%3A%20items.length%20-%201%3B%0A%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20nextIndex%20%3D%20(currentIndex%20%2B%20(e.key%20%3D%3D%3D%20%22ArrowDown%22%20%3F%201%20%3A%20-1)%20%2B%20items.length)%20%25%20items.length%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20items%5BnextIndex%5D.focus()%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D)%3B%0A%20%20%20%20document.addEventListener(%22click%22%2C%20(e)%20%3D%3E%20%7B%0A%20%20%20%20%20%20if%20(isOpen()%20%26%26%20!component.contains(e.target))%20closeDropdown()%3B%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20if%20(component.getAttribute(%22data-open-on-hover-in%22)%20%3D%3D%3D%20%22True%22)%20%7B%0A%20%20%20%20%20%20component.addEventListener(%22mouseenter%22%2C%20()%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20if%20(!isOpen())%20openDropdown()%3B%0A%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20if%20(component.getAttribute(%22data-close-on-hover-out%22)%20%3D%3D%3D%20%22True%22)%20%7B%0A%20%20%20%20%20%20component.addEventListener(%22mouseleave%22%2C%20()%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20if%20(isOpen())%20closeDropdown()%3B%0A%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%7D%0A%20%20%7D)%3B%0A%7D)%3B%0A%3C%2Fscript%3E"
      />
    </_Component>
  ) : null;
}
