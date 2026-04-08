"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import Block from "./_Builtin/Block";
import DOM from "./_Builtin/DOM";
import HtmlEmbed from "./_Builtin/HtmlEmbed";
import { ButtonClose } from "./ButtonClose";

export function Modal({
  as: _Component = DOM,
  classes = "",
  modalContent,
  modalId = "modal-1",
  showInDesigner = false,
  variant = "Small",
  visibility = true,
}) {
  const _styleVariantMap = {
    Small: "",
    "Side Panel": "w-variant-ce8c84b8-072d-28eb-fa41-e255213771e0",
    "Full Screen": "w-variant-abed2e46-044e-db8d-e420-f41a8503c278",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "modal_dialog", _activeStyleVariant)}
      data-modal-target={modalId}
      data-preview={null}
      slot=""
      tag="dialog"
    >
      <HtmlEmbed
        className={_utils.cx(_styles, "u-embed-css", _activeStyleVariant)}
        content=""
        value="%3Cstyle%3E%0A.modal_dialog%3A%3Abackdrop%20%7B%20opacity%3A%200%3B%20%7D%0A.wf-design-mode%20.modal_dialog%3Anot(%3Ahas(%3E%20%5Bdata-w-instance-of%5D))%2C%0A.wf-design-mode%20.modal_dialog%5Bdata-preview%3D%22True%22%5D%20%7B%0A%09display%3A%20block%3B%0A%7D%0A%3C%2Fstyle%3E"
      />
      <Block
        className={_utils.cx(_styles, "modal_inner", _activeStyleVariant)}
        tag="div"
      >
        <Block
          className={_utils.cx(_styles, "modal_backdrop", _activeStyleVariant)}
          data-modal-close=""
          tag="div"
        />
        <Block
          className={_utils.cx(_styles, "modal_content", _activeStyleVariant)}
          tag="div"
        >
          <Block
            className={_utils.cx(_styles, "modal_scroll", _activeStyleVariant)}
            data-lenis-prevent=" "
            data-modal-scroll=""
            tag="div"
          >
            <Block
              className={_utils.cx(_styles, "modal_close", _activeStyleVariant)}
              tag="div"
            >
              <ButtonClose
                attribute1Name="data-modal-close"
                attribute1Value=" "
                attribute2Name="autofocus"
                attribute2Value=" "
              />
            </Block>
            {modalContent}
          </Block>
        </Block>
      </Block>
      <HtmlEmbed
        className={_utils.cx(_styles, "u-embed-js", _activeStyleVariant)}
        content=""
        value="%3Cscript%3E%0Adocument.addEventListener(%22DOMContentLoaded%22%2C%20function%20()%20%7B%0A%09const%20modalSystem%20%3D%20((window.lumos%20%3F%3F%3D%20%7B%7D).modal%20%3F%3F%3D%20%7B%0A%09%09list%3A%20%7B%7D%2C%20open(id)%20%7B%20this.list%5Bid%5D%3F.open%3F.()%3B%20%7D%2C%20closeAll()%20%7B%20Object.values(this.list).forEach((m)%20%3D%3E%20m.close%3F.())%3B%20%7D%2C%0A%09%7D)%3B%0A%09function%20createModals()%20%7B%0A%09%09document.querySelectorAll(%22.modal_dialog%22).forEach(function%20(modal)%20%7B%0A%09%09%09if%20(modal.dataset.scriptInitialized)%20return%3B%0A%09%09%09modal.dataset.scriptInitialized%20%3D%20%22true%22%3B%0A%0A%09%09%09const%20modalId%20%3D%20modal.getAttribute(%22data-modal-target%22)%3B%0A%09%09%09const%20variant%20%3D%20modal.getAttribute(%22data-wf--modal--variant%22)%3B%0A%09%09%09let%20lastFocusedElement%3B%0A%0A%09%09%09if%20(typeof%20gsap%20!%3D%3D%20%22undefined%22)%20%7B%0A%09%09%09%09gsap.context(()%20%3D%3E%20%7B%0A%09%09%09%09%09let%20tl%20%3D%20gsap.timeline(%7B%20paused%3A%20true%2C%20onReverseComplete%3A%20resetModal%20%7D)%3B%0A%09%09%09%09%09if%20(variant%20%3D%3D%3D%20%22side-panel%22)%20%7B%0A%09%09%09%09%09%09tl.fromTo(%22.modal_backdrop%22%2C%20%7B%20opacity%3A%200%20%7D%2C%20%7B%20opacity%3A%201%2C%20duration%3A%200.3%2C%20ease%3A%20%22power1.out%22%20%7D)%3B%0A%09%09%09%09%09%09tl.from(%22.modal_content%22%2C%20%7B%20xPercent%3A%20100%2C%20duration%3A%200.3%2C%20ease%3A%20%22power1.out%22%20%7D%2C%20%22%3C%22)%3B%0A%09%09%09%09%09%7D%20else%20if%20(variant%20%3D%3D%3D%20%22full-screen%22)%20%7B%0A%09%09%09%09%09%09tl.set(%22.modal_backdrop%22%2C%20%7B%20opacity%3A%200%20%7D)%3B%0A%09%09%09%09%09%09tl.from(%22.modal_content%22%2C%20%7B%20opacity%3A%200%2C%20duration%3A%200.2%2C%20ease%3A%20%22power1.out%22%20%7D)%3B%0A%09%09%09%09%09%09tl.from(%22.modal_slot%22%2C%20%7B%20opacity%3A%200%2C%20y%3A%20%222rem%22%2C%20duration%3A%200.2%2C%20ease%3A%20%22power1.out%22%20%7D%2C%20%22%3C0.1%22)%3B%0A%09%09%09%09%09%7D%20else%20%7B%0A%09%09%09%09%09%09tl.fromTo(%22.modal_backdrop%22%2C%20%7B%20opacity%3A%200%20%7D%2C%20%7B%20opacity%3A%201%2C%20duration%3A%200.3%2C%20ease%3A%20%22power1.out%22%20%7D)%3B%0A%09%09%09%09%09%09tl.from(%22.modal_content%22%2C%20%7B%20opacity%3A%200%2C%20y%3A%20%226rem%22%2C%20duration%3A%200.3%2C%20ease%3A%20%22power1.out%22%20%7D%2C%20%22%3C%22)%3B%0A%09%09%09%09%09%7D%0A%09%09%09%09%09modal.tl%20%3D%20tl%3B%0A%09%09%09%09%7D%2C%20modal)%3B%0A%09%09%09%7D%0A%0A%09%09%09function%20resetModal()%20%7B%0A%09%09%09%09typeof%20lenis%20!%3D%3D%20%22undefined%22%20%26%26%20lenis.start%20%3F%20lenis.start()%20%3A%20(document.body.style.overflow%20%3D%20%22%22)%3B%0A%09%09%09%09modal.close()%3B%0A%09%09%09%09if%20(lastFocusedElement)%20lastFocusedElement.focus()%3B%0A%09%09%09%09window.dispatchEvent(new%20CustomEvent(%22modal-close%22%2C%20%7B%20detail%3A%20%7B%20modal%20%7D%20%7D))%3B%0A%09%09%09%7D%0A%09%09%09function%20openModal()%20%7B%0A%09%09%09%09typeof%20lenis%20!%3D%3D%20%22undefined%22%20%26%26%20lenis.stop%20%3F%20lenis.stop()%20%3A%20(document.body.style.overflow%20%3D%20%22hidden%22)%3B%0A%09%09%09%09lastFocusedElement%20%3D%20document.activeElement%3B%0A%09%09%09%09modal.showModal()%3B%0A%09%09%09%09if%20(typeof%20gsap%20!%3D%3D%20%22undefined%22)%20modal.tl.play()%3B%0A%09%09%09%09modal.querySelectorAll(%22%5Bdata-modal-scroll%5D%22).forEach((el)%20%3D%3E%20(el.scrollTop%20%3D%200))%3B%0A%09%09%09%09window.dispatchEvent(new%20CustomEvent(%22modal-open%22%2C%20%7B%20detail%3A%20%7B%20modal%20%7D%20%7D))%3B%0A%09%09%09%7D%0A%09%09%09function%20closeModal()%20%7B%0A%09%09%09%09typeof%20gsap%20!%3D%3D%20%22undefined%22%20%3F%20modal.tl.reverse()%20%3A%20resetModal()%3B%0A%09%09%09%7D%0A%0A%09%09%09if%20(new%20URLSearchParams(location.search).get(%22modal-id%22)%20%3D%3D%3D%20modalId)%20openModal()%2C%20history.replaceState(%7B%7D%2C%20%22%22%2C%20((u)%20%3D%3E%20(u.searchParams.delete(%22modal-id%22)%2C%20u))(new%20URL(location.href)))%3B%0A%09%09%09modal.addEventListener(%22cancel%22%2C%20(e)%20%3D%3E%20(e.preventDefault()%2C%20closeModal()))%3B%0A%09%09%09modal.addEventListener(%22click%22%2C%20(e)%20%3D%3E%20e.target.closest(%22%5Bdata-modal-close%5D%22)%20%26%26%20closeModal())%3B%0A%09%09%09document.addEventListener(%22click%22%2C%20(e)%20%3D%3E%20%7B%0A%09%09%09%09const%20trigger%20%3D%20e.target.closest(%60%5Bdata-modal-trigger%3D'%24%7BmodalId%7D'%5D%2C%20a%5Bhref%3D'%23%24%7BmodalId%7D'%5D%60)%3B%0A%09%09%09%09if%20(!trigger)%20return%3B%0A%09%09%09%09if%20(trigger.tagName%20%3D%3D%3D%20%22A%22)%20e.preventDefault()%3B%0A%09%09%09%09openModal()%3B%0A%09%09%09%7D)%3B%0A%09%09%09modalSystem.list%5BmodalId%5D%20%3D%20%7B%20open%3A%20openModal%2C%20close%3A%20closeModal%20%7D%3B%0A%09%09%7D)%3B%0A%09%7D%0A%09createModals()%3B%0A%7D)%3B%0A%3C%2Fscript%3E"
      />
    </_Component>
  ) : null;
}
