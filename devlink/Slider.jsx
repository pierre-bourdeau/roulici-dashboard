"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import Block from "./_Builtin/Block";
import DOM from "./_Builtin/DOM";
import HtmlEmbed from "./_Builtin/HtmlEmbed";
import { ButtonArrow } from "./ButtonArrow";
import { formatNumber } from "./values/Builtin/formatNumber";

export function Slider({
  as: _Component = DOM,
  classes = " ",
  content,
  settingsControlsVisibility = true,
  settingsFollowFinger = false,
  settingsFreeMode = false,
  settingsMousewheel = false,
  settingsSlideToClickedSlide = false,
  settingsSpeed = 600,
  slidesPerView = "--lg: 4; --md: 3; --sm: 2; --xs: 1;",
  variant = "Overflow Visible",
  visibility = true,
}) {
  const _styleVariantMap = {
    "Overflow Visible": "",
    "Overflow Hidden": "w-variant-bfb8c45c-dbfa-13cc-2dfc-0c02a34504e4",
    "Crop Left": "w-variant-b8ee48da-439e-7156-5d2e-5b4f080e200e",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "slider_wrap", _activeStyleVariant)}
      data-slider="component"
      slot=""
      tag="div"
    >
      <HtmlEmbed
        className={_utils.cx(_styles, "u-embed-css", _activeStyleVariant)}
        content=""
        value="%3Cstyle%3E%0Ahtml%20.slider_list%20%3E%20%3Anot(.u-display-contents%2C%20.w-dyn-list)%2C%0A.slider_list%20%3E%20.w-dyn-list%20%3E%20*%20%3E%20*%20%3E%20*%2C%0A.slider_list%20%3E%20.u-display-contents%20%3E%20*%2C%0A.slider_list%20%3E%20.u-display-contents%20%3E%20.u-display-contents%20%3E%20*%2C%0A.slider_list%20%3E%20.u-display-contents%20%3E%20.w-dyn-list%20%3E%20*%20%3E%20*%20%3E%20*%2C%0A.slider_list%20%3E%20.u-display-contents%20%3E%20.u-display-contents%20%3E%20.w-dyn-list%20%3E%20*%20%3E%20*%20%3E%20*%20%7B%0A%09padding-inline%3A%20calc(var(--_gap---size)%20%2F%202)%3B%0A%09height%3A%20auto%20!important%3B%0A%09flex%3A%200%200%20auto%3B%0A%09width%3A%20calc(100%25%20%2F%20var(--slide-count))%3B%0A%7D%0A.slider_button_layout%3Anot(%3Ahas(button%3Anot(%3Adisabled)))%20%7B%0A%09display%3A%20none%3B%0A%7D%0A%3C%2Fstyle%3E"
      />
      <DOM
        className={_utils.cx(_styles, "slider_offset", _activeStyleVariant)}
        slot=""
        style={slidesPerView}
        tag="div"
      >
        <Block
          className={_utils.cx(
            _styles,
            "slider_element",
            "swiper",
            _activeStyleVariant
          )}
          data-follow-finger={null}
          data-free-mode={null}
          data-mousewheel={null}
          data-slide-to-clicked={null}
          data-speed={formatNumber(-1)(settingsSpeed)}
          editable={true}
          tag="div"
        >
          {content}
        </Block>
      </DOM>
      {settingsControlsVisibility ? (
        <Block
          className={_utils.cx(_styles, "slider_controls", _activeStyleVariant)}
          tag="div"
        >
          <Block
            className={_utils.cx(
              _styles,
              "slider_bullet_list",
              _activeStyleVariant
            )}
            tag="div"
          >
            <Block
              className={_utils.cx(
                _styles,
                "slider_bullet_item",
                "is-active",
                _activeStyleVariant
              )}
              tag="div"
            />
            <Block
              className={_utils.cx(
                _styles,
                "slider_bullet_item",
                _activeStyleVariant
              )}
              tag="div"
            />
          </Block>
          <Block
            className={_utils.cx(
              _styles,
              "slider_button_layout",
              _activeStyleVariant
            )}
            tag="div"
          >
            <ButtonArrow
              arrowDirection="Left"
              attributeName="data-slider"
              attributeValue="previous"
              text="Previous"
              variant="Secondary / Medium"
            />
            <ButtonArrow
              attributeName="data-slider"
              attributeValue="next"
              variant="Secondary / Medium"
            />
          </Block>
        </Block>
      ) : null}
      <HtmlEmbed
        className={_utils.cx(_styles, "u-embed-js", _activeStyleVariant)}
        content=""
        value="%3Clink%20rel%3D%22stylesheet%22%20href%3D%22https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2Fswiper%408%2Fswiper-bundle.min.css%22%3E%0A%3Cscript%20src%3D%22https%3A%2F%2Fcdn.jsdelivr.net%2Fnpm%2Fswiper%408%2Fswiper-bundle.min.js%22%3E%3C%2Fscript%3E%0A%3Cscript%3E%0Adocument.addEventListener(%22DOMContentLoaded%22%2C%20()%20%3D%3E%20%7B%0A%20%20document.querySelectorAll(%22%5Bdata-slider%3D'component'%5D%3Anot(%5Bdata-slider%3D'component'%5D%20%5Bdata-slider%3D'component'%5D)%22).forEach((component)%20%3D%3E%20%7B%0A%20%20%20%20if%20(component.dataset.scriptInitialized)%20return%3B%0A%20%20%20%20component.dataset.scriptInitialized%20%3D%20%22true%22%3B%0A%0A%20%20%20%20const%20swiperElement%20%3D%20component.querySelector(%22.slider_element%22)%3B%0A%20%20%20%20const%20swiperWrapper%20%3D%20component.querySelector(%22.slider_list%22)%3B%0A%20%20%20%20if%20(!swiperElement%20%7C%7C%20!swiperWrapper)%20return%3B%0A%0A%20%20%20%20function%20flattenDisplayContents(slot)%20%7B%0A%20%20%20%20%20%20if%20(!slot)%20return%3B%0A%20%20%20%20%20%20let%20child%20%3D%20slot.firstElementChild%3B%0A%20%20%20%20%20%20while%20(child%20%26%26%20child.classList.contains(%22u-display-contents%22))%20%7B%0A%20%20%20%20%20%20%20%20while%20(child.firstChild)%20%7B%0A%20%20%20%20%20%20%20%20%20%20slot.insertBefore(child.firstChild%2C%20child)%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20slot.removeChild(child)%3B%0A%20%20%20%20%20%20%20%20child%20%3D%20slot.firstElementChild%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%09%09flattenDisplayContents(swiperWrapper)%3B%0A%20%20%20%20%0A%20%20%20%20function%20removeCMSList(slot)%20%7B%0A%20%20%20%20%20%20const%20dynList%20%3D%20Array.from(slot.children).find((child)%20%3D%3E%20child.classList.contains(%22w-dyn-list%22))%3B%0A%20%20%20%20%20%20if%20(!dynList)%20return%3B%0A%20%20%20%20%20%20const%20nestedItems%20%3D%20dynList%3F.querySelector(%22.w-dyn-items%22)%3F.children%3B%0A%20%20%20%20%20%20if%20(!nestedItems)%20return%3B%0A%20%20%20%20%20%20const%20staticWrapper%20%3D%20%5B...slot.children%5D%3B%0A%09%09%09%5B...nestedItems%5D.forEach(el%20%3D%3E%20%7B%20const%20c%20%3D%20%5B...el.children%5D.find(c%20%3D%3E%20!c.classList.contains('w-condition-invisible'))%3B%20c%20%26%26%20slot.appendChild(c)%3B%20%7D)%3B%0A%20%20%20%20%20%20staticWrapper.forEach((el)%20%3D%3E%20el.remove())%3B%0A%20%20%20%20%7D%0A%20%20%20%20removeCMSList(swiperWrapper)%3B%0A%0A%20%20%20%20%5B...swiperWrapper.children%5D.forEach((el)%20%3D%3E%20el.classList.add(%22swiper-slide%22))%3B%0A%0A%20%20%20%20const%20followFinger%20%3D%20swiperElement.getAttribute(%22data-follow-finger%22)%20%3D%3D%3D%20%22True%22%2C%0A%20%20%20%20%20%20freeMode%20%3D%20swiperElement.getAttribute(%22data-free-mode%22)%20%3D%3D%3D%20%22True%22%2C%0A%20%20%20%20%20%20mousewheel%20%3D%20swiperElement.getAttribute(%22data-mousewheel%22)%20%3D%3D%3D%20%22True%22%2C%0A%20%20%20%20%20%20slideToClickedSlide%20%3D%20swiperElement.getAttribute(%22data-slide-to-clicked%22)%20%3D%3D%3D%20%22True%22%2C%0A%20%20%20%20%20%20speed%20%3D%20%2BswiperElement.getAttribute(%22data-speed%22)%20%7C%7C%20600%3B%0A%0A%20%20%20%20new%20Swiper(swiperElement%2C%20%7B%0A%20%20%20%20%20%20slidesPerView%3A%20%22auto%22%2C%0A%20%20%20%20%20%20followFinger%3A%20followFinger%2C%0A%20%20%20%20%20%20loopAdditionalSlides%3A%2010%2C%0A%20%20%20%20%20%20freeMode%3A%20freeMode%2C%0A%20%20%20%20%20%20slideToClickedSlide%3A%20slideToClickedSlide%2C%0A%20%20%20%20%20%20centeredSlides%3A%20false%2C%0A%20%20%20%20%20%20autoHeight%3A%20false%2C%0A%20%20%20%20%20%20speed%3A%20speed%2C%0A%20%20%20%20%20%20mousewheel%3A%20%7B%0A%20%20%20%20%20%20%20%20enabled%3A%20mousewheel%2C%0A%20%20%20%20%20%20%20%20forceToAxis%3A%20true%2C%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20keyboard%3A%20%7B%0A%20%20%20%20%20%20%20%20enabled%3A%20true%2C%0A%20%20%20%20%20%20%20%20onlyInViewport%3A%20true%2C%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20navigation%3A%20%7B%0A%20%20%20%20%20%20%20%20nextEl%3A%20component.querySelector(%22%5Bdata-slider%3D'next'%5D%20button%22)%2C%0A%20%20%20%20%20%20%20%20prevEl%3A%20component.querySelector(%22%5Bdata-slider%3D'previous'%5D%20button%22)%2C%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20pagination%3A%20%7B%0A%20%20%20%20%20%20%20%20el%3A%20component.querySelector(%22.slider_bullet_list%22)%2C%0A%20%20%20%20%20%20%20%20bulletActiveClass%3A%20%22is-active%22%2C%0A%20%20%20%20%20%20%20%20bulletClass%3A%20%22slider_bullet_item%22%2C%0A%20%20%20%20%20%20%20%20bulletElement%3A%20%22button%22%2C%0A%20%20%20%20%20%20%20%20clickable%3A%20true%2C%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20slideActiveClass%3A%20%22is-active%22%2C%0A%20%20%20%20%20%20slideDuplicateActiveClass%3A%20%22is-active%22%2C%0A%20%20%20%20%7D)%3B%0A%20%20%7D)%3B%0A%7D)%3B%0A%3C%2Fscript%3E"
      />
    </_Component>
  ) : null;
}
