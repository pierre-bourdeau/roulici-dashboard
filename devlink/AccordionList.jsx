"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import DOM from "./_Builtin/DOM";
import HtmlEmbed from "./_Builtin/HtmlEmbed";
import { formatNumber } from "./values/Builtin/formatNumber";

export function AccordionList({
  as: _Component = DOM,
  accordionItem,
  classes = "",
  closeOnSecondClick = false,
  closePrevious = false,
  openByDefaultItem = 0,
  openOnHover = false,
  style = "",
  visibility = true,
}) {
  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "accordion_wrap")}
      data-close-on-second-click={null}
      data-close-previous={null}
      data-open-by-default={formatNumber(-1)(openByDefaultItem)}
      data-open-on-hover={null}
      slot=""
      style={style}
      tag="div"
    >
      <HtmlEmbed
        className={_utils.cx(_styles, "u-embed-css")}
        content=""
        value="%3Cstyle%3E%0A.wf-design-mode%20.accordion_content_wrap%20%7B%0A%09display%3A%20block%3B%0A%7D%0A%3C%2Fstyle%3E"
      />
      {accordionItem}
      <HtmlEmbed
        className={_utils.cx(_styles, "u-embed-js")}
        content=""
        value="%3Cscript%3E%0Adocument.addEventListener(%22DOMContentLoaded%22%2C%20function%20()%20%7B%0A%20%20document.querySelectorAll(%22.accordion_wrap%22).forEach((component%2C%20listIndex)%20%3D%3E%20%7B%0A%20%20%20%20if%20(component.dataset.scriptInitialized)%20return%3B%0A%20%20%20%20component.dataset.scriptInitialized%20%3D%20%22true%22%3B%0A%0A%20%20%20%20const%20closePrevious%20%3D%20component.getAttribute(%22data-close-previous%22)%20!%3D%3D%20%22False%22%3B%0A%20%20%20%20const%20closeOnSecondClick%20%3D%20component.getAttribute(%22data-close-on-second-click%22)%20!%3D%3D%20%22False%22%3B%0A%20%20%20%20const%20openOnHover%20%3D%20component.getAttribute(%22data-open-on-hover%22)%20%3D%3D%3D%20%22True%22%3B%0A%20%20%20%20const%20openByDefault%20%3D%20component.getAttribute(%22data-open-by-default%22)%20!%3D%3D%20null%20%26%26%20!isNaN(%2Bcomponent.getAttribute(%22data-open-by-default%22))%20%3F%20%2Bcomponent.getAttribute(%22data-open-by-default%22)%20%3A%20false%3B%0A%09%09const%20list%20%3D%20component.querySelector(%22.accordion_list%22)%3B%0A%20%20%20%20let%20previousIndex%20%3D%20null%2C%0A%20%20%20%20%20%20closeFunctions%20%3D%20%5B%5D%3B%0A%0A%20%20%20%20function%20flattenDisplayContents(slot)%20%7B%0A%20%20%20%20%20%20if%20(!slot)%20return%3B%0A%20%20%20%20%20%20let%20child%20%3D%20slot.firstElementChild%3B%0A%20%20%20%20%20%20while%20(child%20%26%26%20child.classList.contains(%22u-display-contents%22))%20%7B%0A%20%20%20%20%20%20%20%20while%20(child.firstChild)%20%7B%0A%20%20%20%20%20%20%20%20%20%20slot.insertBefore(child.firstChild%2C%20child)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20slot.removeChild(child)%3B%0A%20%20%20%20%20%20%20%20child%20%3D%20slot.firstElementChild%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%09%09flattenDisplayContents(list)%3B%0A%0A%20%20%20%20function%20removeCMSList(slot)%20%7B%0A%20%20%20%20%20%20const%20dynList%20%3D%20Array.from(slot.children).find((child)%20%3D%3E%20child.classList.contains(%22w-dyn-list%22))%3B%0A%20%20%20%20%20%20if%20(!dynList)%20return%3B%0A%20%20%20%20%20%20const%20nestedItems%20%3D%20dynList%3F.querySelector(%22.w-dyn-items%22)%3F.children%3B%0A%20%20%20%20%20%20if%20(!nestedItems)%20return%3B%0A%20%20%20%20%20%20const%20staticWrapper%20%3D%20%5B...slot.children%5D%3B%0A%09%09%09%5B...nestedItems%5D.forEach(el%20%3D%3E%20%7B%20const%20c%20%3D%20%5B...el.children%5D.find(c%20%3D%3E%20!c.classList.contains('w-condition-invisible'))%3B%20c%20%26%26%20slot.appendChild(c)%3B%20%7D)%3B%0A%20%20%20%20%20%20staticWrapper.forEach((el)%20%3D%3E%20el.remove())%3B%0A%20%20%20%20%7D%0A%20%20%20%20removeCMSList(list)%3B%0A%0A%20%20%20%20component.querySelectorAll(%22.accordion_component%22).forEach((card%2C%20cardIndex)%20%3D%3E%20%7B%0A%20%20%20%20%20%20const%20button%20%3D%20card.querySelector(%22.accordion_toggle_button%22)%3B%0A%20%20%20%20%20%20const%20content%20%3D%20card.querySelector(%22.accordion_content_wrap%22)%3B%0A%0A%20%20%20%20%20%20if%20(!button%20%7C%7C%20!content)%20return%20console.warn(%22Missing%20elements%3A%22%2C%20card)%3B%0A%0A%20%20%20%20%20%20button.setAttribute(%22aria-expanded%22%2C%20%22false%22)%3B%0A%20%20%20%20%20%20button.setAttribute(%22id%22%2C%20%22accordion_button_%22%20%2B%20listIndex%20%2B%20%22_%22%20%2B%20cardIndex)%3B%0A%20%20%20%20%20%20content.setAttribute(%22id%22%2C%20%22accordion_content_%22%20%2B%20listIndex%20%2B%20%22_%22%20%2B%20cardIndex)%3B%0A%20%20%20%20%20%20button.setAttribute(%22aria-controls%22%2C%20content.id)%3B%0A%20%20%20%20%20%20content.setAttribute(%22aria-labelledby%22%2C%20button.id)%3B%0A%20%20%20%20%20%20content.style.display%20%3D%20%22none%22%3B%0A%0A%20%20%20%20%20%20const%20refresh%20%3D%20()%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20tl.invalidate()%3B%0A%20%20%20%20%20%20%20%20if%20(typeof%20ScrollTrigger%20!%3D%3D%20%22undefined%22)%20ScrollTrigger.refresh()%3B%0A%20%20%20%20%20%20%7D%3B%0A%20%20%20%20%20%20const%20tl%20%3D%20gsap.timeline(%7B%20paused%3A%20true%2C%20defaults%3A%20%7B%20duration%3A%200.3%2C%20ease%3A%20%22power1.inOut%22%20%7D%2C%20onComplete%3A%20refresh%2C%20onReverseComplete%3A%20refresh%20%7D)%3B%0A%20%20%20%20%20%20tl.set(content%2C%20%7B%20display%3A%20%22block%22%20%7D)%3B%0A%20%20%20%20%20%20tl.fromTo(content%2C%20%7B%20height%3A%200%20%7D%2C%20%7B%20height%3A%20%22auto%22%20%7D)%3B%0A%0A%20%20%20%20%20%20const%20closeAccordion%20%3D%20()%20%3D%3E%20card.classList.contains(%22is-active%22)%20%26%26%20(card.classList.remove(%22is-active%22)%2C%20tl.reverse()%2C%20button.setAttribute(%22aria-expanded%22%2C%20%22false%22))%3B%0A%20%20%20%20%20%20closeFunctions%5BcardIndex%5D%20%3D%20closeAccordion%3B%0A%0A%20%20%20%20%20%20const%20openAccordion%20%3D%20(instant%20%3D%20false)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20if%20(closePrevious%20%26%26%20previousIndex%20!%3D%3D%20null%20%26%26%20previousIndex%20!%3D%3D%20cardIndex)%20closeFunctions%5BpreviousIndex%5D%3F.()%3B%0A%20%20%20%20%20%20%20%20previousIndex%20%3D%20cardIndex%3B%0A%20%20%20%20%20%20%20%20button.setAttribute(%22aria-expanded%22%2C%20%22true%22)%3B%0A%20%20%20%20%20%20%20%20card.classList.add(%22is-active%22)%3B%0A%20%20%20%20%20%20%20%20instant%20%3F%20tl.progress(1)%20%3A%20tl.play()%3B%0A%20%20%20%20%20%20%7D%3B%0A%20%20%20%20%20%20if%20(openByDefault%20%3D%3D%3D%20cardIndex%20%2B%201)%20openAccordion(true)%3B%0A%0A%20%20%20%20%20%20button.addEventListener(%22click%22%2C%20()%20%3D%3E%20(card.classList.contains(%22is-active%22)%20%26%26%20closeOnSecondClick%20%3F%20(closeAccordion()%2C%20(previousIndex%20%3D%20null))%20%3A%20openAccordion()))%3B%0A%20%20%20%20%20%20if%20(openOnHover)%20button.addEventListener(%22mouseenter%22%2C%20()%20%3D%3E%20openAccordion())%3B%0A%20%20%20%20%7D)%3B%0A%20%20%7D)%3B%0A%7D)%3B%0A%3C%2Fscript%3E"
      />
    </_Component>
  ) : null;
}
