"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import Block from "./_Builtin/Block";
import HtmlEmbed from "./_Builtin/HtmlEmbed";
import { ButtonArrow } from "./ButtonArrow";
import { ButtonPlay } from "./ButtonPlay";
import { formatNumber } from "./values/Builtin/formatNumber";

export function Tab({
  as: _Component = Block,
  autoplayDuration = "",
  classes = "",
  componentId = "",
  controlsVisibility = false,
  heading,
  loopControls = false,
  pauseOnHover = false,
  previewContent = false,
  slideTabs = false,
  tabContent,
  tabLink,
  transitionDuration = 0.6,
  variant = "Base",
  visibility = true,
}) {
  const _styleVariantMap = {
    Base: "",
    Horizontal: "w-variant-490ac534-1fb5-5322-5b2f-0dc20ea2f909",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      className={_utils.cx(_styles, "tab_wrap", _activeStyleVariant)}
      data-autoplay-duration={autoplayDuration}
      data-duration={formatNumber(-1)(transitionDuration)}
      data-loop-controls={null}
      data-pause-on-hover={null}
      data-slide-tabs={null}
      data-tab-component-id={componentId}
      tag="div"
    >
      <HtmlEmbed
        className={_utils.cx(_styles, "u-embed-css", _activeStyleVariant)}
        content=""
        value="%3Cstyle%3E%0A.tab_content_list%5Bdata-preview%3D%22False%22%5D%20%3E%20%3Anot(.w-dyn-list%2C.u-display-contents)%2C%0A.tab_content_list%5Bdata-preview%3D%22False%22%5D%20%3E%20.w-dyn-list%20%3E%20*%20%3E%20*%20%3E%20*%2C%0A.tab_content_list%5Bdata-preview%3D%22False%22%5D%20%3E%20.u-display-contents%20%3E%20.w-dyn-list%20%3E%20*%20%3E%20*%20%3E%20*%2C%0A.tab_content_list%5Bdata-preview%3D%22False%22%5D%20%3E%20.u-display-contents%20%3E%20.u-display-contents%20%3E%20.w-dyn-list%20%3E%20*%20%3E%20*%20%3E%20*%2C%0A.tab_content_list%5Bdata-preview%3D%22False%22%5D%20%3E%20.u-display-contents%20%3E%20%3Anot(.w-dyn-list%2C.u-display-contents)%2C%0A.tab_content_list%5Bdata-preview%3D%22False%22%5D%20%3E%20.u-display-contents%20%3E%20.u-display-contents%20%3E%20%3Anot(.w-dyn-list%2C.u-display-contents)%20%7B%0A%09display%3A%20none%3B%0A%7D%0A.tab_content_list%20%3E%20%3Afirst-child%3Anot(.w-dyn-list%2C.u-display-contents)%2C%0A.tab_content_list%20%3E%20.w-dyn-list%20%3E%20*%20%3E%20%3Afirst-child%20%3E%20*%2C%0A.tab_content_list%20%3E%20.u-display-contents%20%3E%20.w-dyn-list%20%3E%20*%20%3E%20%3Afirst-child%20%3E%20*%2C%0A.tab_content_list%20%3E%20.u-display-contents%20%3E%20.u-display-contents%20%3E%20.w-dyn-list%20%3E%20*%20%3E%20%3Afirst-child%20%3E%20*%2C%0A.tab_content_list%20%3E%20.u-display-contents%20%3E%20%3Anot(.w-dyn-list%2C.u-display-contents)%3Afirst-child%2C%0A.tab_content_list%20%3E%20.u-display-contents%20%3E%20.u-display-contents%20%3E%20%3Anot(.w-dyn-list%2C.u-display-contents)%3Afirst-child%20%7B%0A%09display%3A%20block%3B%0A%7D%0A.wf-design-mode%20.tab_button_list%20%3E%20%3Afirst-child%3Anot(.w-dyn-list%2C.u-display-contents)%2C%0A.wf-design-mode%20.tab_button_list%20%3E%20.w-dyn-list%20%3E%20*%20%3E%20%3Afirst-child%20%3E%20*%2C%0A.wf-design-mode%20.tab_button_list%20%3E%20.u-display-contents%20%3E%20%3Afirst-child%3Anot(.w-dyn-list%2C.u-display-contents)%2C%0A.wf-design-mode%20.tab_button_list%20%3E%20.u-display-contents%20%3E%20.u-display-contents%20%3E%20%3Afirst-child%3Anot(.w-dyn-list%2C.u-display-contents)%2C%0A.wf-design-mode%20.tab_button_list%20%3E%20.u-display-contents%20%3E%20.w-dyn-list%20%3E%20*%20%3E%20%3Afirst-child%20%3E%20*%2C%0A.wf-design-mode%20.tab_button_list%20%3E%20.u-display-contents%20%3E%20.u-display-contents%20%3E%20.w-dyn-list%20%3E%20*%20%3E%20%3Afirst-child%20%3E%20*%20%7B%0A%09--_state---true%3A%200%3B%0A%20%20--_state---false%3A%201%3B%0A%7D%0A.tab_button_list%3Ahas(%5Bdata-wf--tab-link--variant%3D%22link%22%5D)%20%7B%20gap%3A%200rem%3B%20%7D%0A%3C%2Fstyle%3E"
      />
      <Block
        className={_utils.cx(_styles, "tab_left", _activeStyleVariant)}
        tag="div"
      >
        {heading}
        {tabLink}
      </Block>
      <Block
        className={_utils.cx(_styles, "tab_right", _activeStyleVariant)}
        tag="div"
      >
        <Block
          className={_utils.cx(
            _styles,
            "tab_content_wrap",
            _activeStyleVariant
          )}
          tag="div"
        >
          {tabContent}
        </Block>
        {controlsVisibility ? (
          <Block
            className={_utils.cx(
              _styles,
              "tab_control_wrap",
              _activeStyleVariant
            )}
            tag="div"
          >
            <Block
              className={_utils.cx(
                _styles,
                "tab_arrow_wrap",
                _activeStyleVariant
              )}
              tag="div"
            >
              <ButtonArrow
                arrowDirection="Left"
                attributeName="data-tab"
                attributeValue="previous"
                variant="Secondary / Medium"
              />
              <ButtonArrow
                attributeName="data-tab"
                attributeValue="next"
                variant="Secondary / Medium"
              />
            </Block>
            <ButtonPlay
              attributeName="data-tab-button"
              attributeValue="toggle"
              text="Start automatic tab rotation"
              variant="Secondary / Medium"
            />
          </Block>
        ) : null}
      </Block>
      <HtmlEmbed
        className={_utils.cx(_styles, "u-embed-js", _activeStyleVariant)}
        content=""
        value="%3Cscript%3E%0Adocument.addEventListener(%22DOMContentLoaded%22%2C%20function%20()%20%7B%0A%09document.querySelectorAll(%22.tab_wrap%22).forEach((tabWrap%2C%20componentIndex)%20%3D%3E%20%7B%0A%09%09if%20(tabWrap.dataset.scriptInitialized)%20return%3B%0A%09%09tabWrap.dataset.scriptInitialized%20%3D%20%22true%22%3B%0A%09%09let%20loopControls%20%3D%20tabWrap.getAttribute(%22data-loop-controls%22)%20%3D%3D%3D%20%22True%22%2C%0A%09%09%09slideTabs%20%3D%20tabWrap.getAttribute(%22data-slide-tabs%22)%20%3D%3D%3D%20%22True%22%2C%0A%09%09%09pauseOnHover%20%3D%20tabWrap.getAttribute(%22data-pause-on-hover%22)%20%3D%3D%3D%20%22True%22%2C%0A%09%09%09autoplay%20%3D%20Number(tabWrap.getAttribute(%22data-autoplay-duration%22))%20%7C%7C%200%2C%0A%09%09%09duration%20%3D%20Number(tabWrap.getAttribute(%22data-duration%22))%20%7C%7C%200.3%2C%0A%09%09%09buttonList%20%3D%20tabWrap.querySelector(%22.tab_button_list%22)%2C%0A%09%09%09panelList%20%3D%20tabWrap.querySelector(%22.tab_content_list%22)%2C%0A%09%09%09previousButton%20%3D%20tabWrap.querySelector(%22%5Bdata-tab%3D'previous'%5D%20button%22)%2C%0A%09%09%09nextButton%20%3D%20tabWrap.querySelector(%22%5Bdata-tab%3D'next'%5D%20button%22)%2C%0A%09%09%09toggleWrap%20%3D%20tabWrap.querySelector(%22%5Bdata-tab-button%3D'toggle'%5D%22)%2C%0A%09%09%09toggleButton%20%3D%20tabWrap.querySelector(%22%5Bdata-tab-button%3D'toggle'%5D%20button%22)%2C%0A%20%20%20%20%20%20animating%20%3D%20false%2C%0A%20%20%20%20%20%20canPlay%20%3D%20true%2C%0A%20%20%20%20%20%20autoplayTl%3B%0A%0A%20%20%20%20function%20flattenDisplayContents(slot)%20%7B%0A%20%20%20%20%20%20if%20(!slot)%20return%3B%0A%20%20%20%20%20%20let%20child%20%3D%20slot.firstElementChild%3B%0A%20%20%20%20%20%20while%20(child%20%26%26%20child.classList.contains(%22u-display-contents%22))%20%7B%0A%20%20%20%20%20%20%20%20while%20(child.firstChild)%20%7B%0A%20%20%20%20%20%20%20%20%20%20slot.insertBefore(child.firstChild%2C%20child)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20slot.removeChild(child)%3B%0A%20%20%20%20%20%20%20%20child%20%3D%20slot.firstElementChild%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%09%09flattenDisplayContents(buttonList)%3B%0A%09%09flattenDisplayContents(panelList)%3B%0A%0A%20%20%20%20function%20removeCMSList(slot)%20%7B%0A%20%20%20%20%20%20const%20dynList%20%3D%20Array.from(slot.children).find((child)%20%3D%3E%20child.classList.contains(%22w-dyn-list%22))%3B%0A%20%20%20%20%20%20if%20(!dynList)%20return%3B%0A%20%20%20%20%20%20const%20nestedItems%20%3D%20dynList%3F.querySelector(%22.w-dyn-items%22)%3F.children%3B%0A%20%20%20%20%20%20if%20(!nestedItems)%20return%3B%0A%20%20%20%20%20%20const%20staticWrapper%20%3D%20%5B...slot.children%5D%3B%0A%09%09%09%5B...nestedItems%5D.forEach(el%20%3D%3E%20%7B%20const%20c%20%3D%20%5B...el.children%5D.find(c%20%3D%3E%20!c.classList.contains('w-condition-invisible'))%3B%20c%20%26%26%20slot.appendChild(c)%3B%20%7D)%3B%0A%20%20%20%20%20%20staticWrapper.forEach((el)%20%3D%3E%20el.remove())%3B%0A%20%20%20%20%7D%0A%20%20%20%20removeCMSList(buttonList)%3B%0A%20%20%20%20removeCMSList(panelList)%3B%0A%0A%09%09let%20buttonItems%20%3D%20Array.from(buttonList.children)%3B%0A%20%20%20%20let%20panelItems%20%3D%20Array.from(panelList.children)%3B%0A%0A%09%09if%20(!buttonList%20%7C%7C%20!panelList%20%7C%7C%20!buttonItems.length%20%7C%7C%20!panelItems.length)%20%7B%0A%09%09%09console.warn(%22Missing%20elements%20in%3A%22%2C%20tabWrap)%3B%0A%09%09%09return%3B%0A%09%09%7D%0A%0A%09%09panelItems.forEach((panel%2C%20i)%20%3D%3E%20%7Bpanel.style.display%20%3D%20%22none%22%3B%20panel.setAttribute(%22role%22%2C%20%22tabpanel%22)%3B%7D)%3B%0A%09%09buttonItems.forEach((button%2C%20i)%20%3D%3E%20%7Bbutton.setAttribute(%22role%22%2C%20%22tab%22)%3B%7D)%3B%0A%0A%09%09panelList.removeAttribute(%22role%22)%3B%0A%09%09buttonList.setAttribute(%22role%22%2C%20%22tablist%22)%3B%0A%09%09buttonItems.forEach((btn)%20%3D%3E%20btn.setAttribute(%22role%22%2C%20%22tab%22))%3B%0A%09%09panelItems.forEach((panel)%20%3D%3E%20panel.setAttribute(%22role%22%2C%20%22tabpanel%22))%3B%0A%0A%09%09let%20activeIndex%20%3D%200%3B%0A%09%09const%20makeActive%20%3D%20(index%2C%20focus%20%3D%20false%2C%20animate%20%3D%20true%2C%20pause%20%3D%20true)%20%3D%3E%20%7B%0A%09%09%09if%20(animating)%20return%3B%0A%09%09%09buttonItems.forEach((btn%2C%20i)%20%3D%3E%20%7B%0A%09%09%09%09btn.classList.toggle(%22is-active%22%2C%20i%20%3D%3D%3D%20index)%3B%0A%09%09%09%09btn.setAttribute(%22aria-selected%22%2C%20i%20%3D%3D%3D%20index%20%3F%20%22true%22%20%3A%20%22false%22)%3B%0A%09%09%09%09btn.setAttribute(%22tabindex%22%2C%20i%20%3D%3D%3D%20index%20%3F%20%220%22%20%3A%20%22-1%22)%3B%0A%09%09%09%7D)%3B%0A%09%09%09panelItems.forEach((panel%2C%20i)%20%3D%3E%20panel.classList.toggle(%22is-active%22%2C%20i%20%3D%3D%3D%20index))%3B%0A%09%09%09if%20(nextButton)%20nextButton.disabled%20%3D%20index%20%3D%3D%3D%20buttonItems.length%20-%201%20%26%26%20!loopControls%3B%0A%09%09%09if%20(previousButton)%20previousButton.disabled%20%3D%20index%20%3D%3D%3D%200%20%26%26%20!loopControls%3B%0A%09%09%09if%20(focus)%20buttonItems%5Bindex%5D.focus()%3B%0A%09%09%09const%20previousPanel%20%3D%20panelItems%5BactiveIndex%5D%3B%0A%20%20%20%20%20%20const%20currentPanel%20%3D%20panelItems%5Bindex%5D%3B%0A%20%20%20%20%20%20let%20direction%20%3D%201%3B%0A%20%20%20%20%20%20if%20(activeIndex%20%3E%20index)%20direction%20%3D%20-1%3B%0A%20%20%20%20%20%20%0A%09%09%09if%20(typeof%20gsap%20!%3D%3D%20%22undefined%22%20%26%26%20animate%20%26%26%20activeIndex%20!%3D%3D%20index)%20%7B%0A%09%09%09%09if%20(autoplayTl%20%26%26%20!canPlay%20%26%26%20typeof%20autoplayTl.restart%20%3D%3D%3D%20%22function%22)%20%7B%0A%09%09%09%09%09autoplayTl.restart()%3B%0A%09%09%09%09%7D%0A%09%09%09%09animating%20%3D%20true%3B%0A%09%09%09%09let%20tl%20%3D%20gsap.timeline(%7B%20onComplete%3A%20()%20%3D%3E%20%7Banimating%20%3D%20false%3B%20if%20(typeof%20ScrollTrigger%20!%3D%3D%20%22undefined%22)%20ScrollTrigger.refresh()%3B%7D%2C%20defaults%3A%20%7B%20duration%3A%20duration%2C%20ease%3A%20%22power1.out%22%20%7D%20%7D)%3B%0A%09%09%09%09if%20(slideTabs)%20%7B%0A%09%09%09%09%09tl.set(currentPanel%2C%20%7B%20display%3A%20%22block%22%2C%20position%3A%20%22relative%22%20%7D)%3B%0A%09%09%09%09%09if%20(previousPanel)%20tl.set(previousPanel%2C%20%7B%20position%3A%20%22absolute%22%2C%20top%3A%200%2C%20left%3A%200%2C%20width%3A%20%22100%25%22%20%7D)%3B%0A%09%09%09%09%09if%20(previousPanel)%20tl.fromTo(previousPanel%2C%20%7B%20xPercent%3A%200%20%7D%2C%20%7B%20xPercent%3A%20-120%20*%20direction%20%7D)%3B%0A%09%09%09%09%09tl.fromTo(currentPanel%2C%20%7B%20xPercent%3A%20120%20*%20direction%20%7D%2C%20%7B%20xPercent%3A%200%20%7D%2C%20%22%3C%22)%3B%0A%20%20%20%20%20%20%20%20%09if%20(previousPanel)%20tl.set(previousPanel%2C%20%7B%20display%3A%20%22none%22%20%7D)%3B%0A%09%09%09%09%7D%20else%20%7B%0A%09%09%09%09%09if%20(previousPanel)%20tl.to(previousPanel%2C%20%7B%20opacity%3A%200%20%7D)%3B%0A%20%20%20%20%20%20%20%20%09if%20(previousPanel)%20tl.set(previousPanel%2C%20%7B%20display%3A%20%22none%22%20%7D)%3B%0A%09%09%09%09%09tl.set(currentPanel%2C%20%7B%20display%3A%20%22block%22%20%7D)%3B%0A%09%09%09%09%09tl.fromTo(currentPanel%2C%20%7B%20opacity%3A%200%20%7D%2C%20%7B%20opacity%3A%201%20%7D)%3B%0A%09%09%09%09%7D%0A%09%09%09%7D%20else%20%7B%0A%09%09%09%09if%20(previousPanel)%20previousPanel.style.display%20%3D%20%22none%22%3B%0A%09%09%09%09if%20(currentPanel)%20currentPanel.style.display%20%3D%20%22block%22%3B%0A%09%09%09%7D%0A%20%20%09%09buttonList.scrollTo(%7B%20left%3A%20buttonItems%5Bindex%5D.offsetLeft%2C%20behavior%3A%20'smooth'%20%7D)%3B%0A%09%09%09activeIndex%20%3D%20index%3B%0A%09%09%7D%3B%0A%0A%09%09makeActive(0%2C%20false%2C%20false)%3B%0A%0A%09%09const%20updateIndex%20%3D%20(delta%2C%20focus%20%3D%20false%2C%20pause%20%3D%20true)%20%3D%3E%20makeActive((activeIndex%20%2B%20delta%20%2B%20buttonItems.length)%20%25%20buttonItems.length%2C%20focus%2C%20true%2C%20pause)%3B%0A%09%09nextButton%3F.addEventListener(%22click%22%2C%20()%20%3D%3E%20updateIndex(1))%3B%0A%09%09previousButton%3F.addEventListener(%22click%22%2C%20()%20%3D%3E%20updateIndex(-1))%3B%0A%0A%09%09buttonItems.forEach((btn%2C%20index)%20%3D%3E%20%7B%0A%09%09%09let%20tabId%20%3D%20tabWrap.getAttribute(%22data-tab-component-id%22)%3B%0A%09%09%09tabId%20%3D%20tabId%20%3F%20tabId.toLowerCase().replaceAll(%22%20%22%2C%20%22-%22)%20%3A%20componentIndex%20%2B%201%3B%0A%09%09%09let%20itemId%20%3D%20btn.getAttribute(%22data-tab-item-id%22)%3B%0A%09%09%09itemId%20%3D%20itemId%20%3F%20itemId.toLowerCase().replaceAll(%22%20%22%2C%20%22-%22)%20%3A%20index%20%2B%201%3B%0A%0A%09%09%09btn.setAttribute(%22id%22%2C%20%22tab-button-%22%20%2B%20tabId%20%2B%20%22-%22%20%2B%20itemId)%3B%0A%09%09%09btn.setAttribute(%22aria-controls%22%2C%20%22tab-panel-%22%20%2B%20tabId%20%2B%20%22-%22%20%2B%20itemId)%3B%0A%09%09%09panelItems%5Bindex%5D%3F.setAttribute(%22id%22%2C%20%22tab-panel-%22%20%2B%20tabId%20%2B%20%22-%22%20%2B%20itemId)%3B%0A%09%09%09panelItems%5Bindex%5D%3F.setAttribute(%22aria-labelledby%22%2C%20btn.id)%3B%0A%20%20%20%20%20%20%0A%09%09%09if%20(new%20URLSearchParams(location.search).get(%22tab-id%22)%20%3D%3D%3D%20tabId%20%2B%20%22-%22%20%2B%20itemId)%20makeActive(index)%2C%20autoplay%20%3D%200%2C%20tabWrap.scrollIntoView(%7Bbehavior%3A%20%22smooth%22%2C%20block%3A%20%22start%22%7D)%2C%20history.replaceState(%7B%7D%2C%20%22%22%2C%20((u)%20%3D%3E%20(u.searchParams.delete(%22tab-id%22)%2C%20u))(new%20URL(location.href)))%3B%0A%09%09%09btn.addEventListener(%22click%22%2C%20()%20%3D%3E%20makeActive(index))%3B%0A%09%09%09btn.addEventListener(%22keydown%22%2C%20(e)%20%3D%3E%20%7B%0A%09%09%09%09if%20(%5B%22ArrowRight%22%2C%20%22ArrowDown%22%5D.includes(e.key))%20updateIndex(1%2C%20true)%3B%0A%09%09%09%09else%20if%20(%5B%22ArrowLeft%22%2C%20%22ArrowUp%22%5D.includes(e.key))%20updateIndex(-1%2C%20true)%3B%0A%09%09%09%7D)%3B%0A%09%09%7D)%3B%0A%0A%20%20%20%20if%20(autoplay%20!%3D%3D%200%20%26%26%20typeof%20gsap%20!%3D%3D%20%22undefined%22)%20%7B%0A%20%20%20%20%20%20autoplayTl%20%3D%20gsap.timeline(%7B%20repeat%3A%20-1%20%7D).fromTo(tabWrap%2C%20%7B%22--progress%22%3A%200%7D%2C%20%7B%20onComplete%3A%20()%20%3D%3E%20updateIndex(1%2C%20false%2C%20false)%2C%20%22--progress%22%3A%201%2C%20ease%3A%20%22none%22%2C%20duration%3A%20autoplay%20%7D)%3B%0A%20%20%20%20%20%20let%20isHovered%20%3D%20false%2C%20hasFocusInside%20%3D%20false%2C%20prefersReducedMotion%20%3D%20false%2C%20inView%20%3D%20true%3B%0A%20%20%20%20%20%20function%20updateAuto()%20%7B%20if%20(prefersReducedMotion%20%7C%7C%20!inView%20%7C%7C%20canPlay%20%7C%7C%20isHovered%20%7C%7C%20hasFocusInside)%20autoplayTl.pause()%3B%20else%20autoplayTl.play()%3B%20%7D%0A%20%20%20%20%20%20function%20setButton()%20%7B%0A%09%09%09%09canPlay%20%3D%20!canPlay%3B%0A%20%20%20%20%20%20%20%20toggleButton%3F.setAttribute(%22aria-pressed%22%2C%20!canPlay%20%3F%20%22true%22%20%3A%20%22false%22)%3B%0A%20%20%20%20%20%20%20%20toggleWrap%3F.classList.toggle(%22is-pressed%22%2C%20!canPlay)%3B%0A%09%09%09%09if%20(!canPlay)%20isHovered%20%3D%20hasFocusInside%20%3D%20prefersReducedMotion%20%3D%20false%3B%0A%09%09%09%09updateAuto()%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20setButton()%3B%0A%09%09%09toggleButton%3F.addEventListener(%22click%22%2C%20function%20()%20%7B%0A%09%09%09%09setButton()%3B%0A%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20function%20handleMotionChange(e)%20%7B%20prefersReducedMotion%20%3D%20e.matches%3B%20updateAuto()%3B%20canPlay%20%3D%20!e.matches%3B%20setButton()%3B%20%7D%0A%20%20%20%20%20%20handleMotionChange(window.matchMedia(%22(prefers-reduced-motion%3A%20reduce)%22))%3B%0A%20%20%20%20%20%20window.matchMedia(%22(prefers-reduced-motion%3A%20reduce)%22).addEventListener(%22change%22%2C%20handleMotionChange)%3B%0A%20%20%20%20%20%20if%20(pauseOnHover)%20tabWrap.addEventListener(%22mouseenter%22%2C%20()%20%3D%3E%20%7B%20isHovered%20%3D%20true%3B%20updateAuto()%20%7D)%3B%0A%20%20%20%20%20%20if%20(pauseOnHover)%20tabWrap.addEventListener(%22mouseleave%22%2C%20()%20%3D%3E%20%7B%20hasFocusInside%20%3D%20false%3B%20isHovered%20%3D%20false%3B%20updateAuto()%20%7D)%3B%0A%20%20%20%20%20%20tabWrap.addEventListener(%22focusin%22%2C%20()%20%3D%3E%20%7B%20hasFocusInside%20%3D%20true%3B%20updateAuto()%20%7D)%3B%0A%20%20%20%20%20%20tabWrap.addEventListener(%22focusout%22%2C%20e%20%3D%3E%20%7B%20if%20(!e.relatedTarget%20%7C%7C%20!tabWrap.contains(e.relatedTarget))%20%7B%20hasFocusInside%20%3D%20false%3B%20updateAuto()%20%7D%20%7D)%3B%0A%20%20%20%20%20%20new%20IntersectionObserver(e%20%3D%3E%20%7B%20inView%20%3D%20e%5B0%5D.isIntersecting%3B%20updateAuto()%3B%20%7D%2C%20%7B%20threshold%3A%200%20%7D).observe(tabWrap)%3B%0A%20%20%20%20%7D%0A%0A%09%7D)%3B%0A%7D)%3B%0A%3C%2Fscript%3E"
      />
    </_Component>
  ) : null;
}
