"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import Block from "./_Builtin/Block";
import HtmlEmbed from "./_Builtin/HtmlEmbed";
import Link from "./_Builtin/Link";
import NavbarButton from "./_Builtin/NavbarButton";
import NavbarMenu from "./_Builtin/NavbarMenu";
import NavbarWrapper from "./_Builtin/NavbarWrapper";
import { Logo } from "./Logo";
import { Menu } from "./Menu";
import { NavBanner } from "./NavBanner";

export function Nav({ as: _Component = Block, navPosition = "Default" }) {
  const _styleVariantMap = {
    Default: "",
    Overlap: "w-variant-dd866659-1d7d-6447-6461-66ca86ca367f",
  };

  const _activeStyleVariant = _styleVariantMap[navPosition];

  return (
    <_Component
      className={_utils.cx(_styles, "nav_component", _activeStyleVariant)}
      tag="div"
    >
      <HtmlEmbed
        className={_utils.cx(_styles, "u-embed-css", _activeStyleVariant)}
        content=""
        value="%3Cstyle%3E%0A%3Aroot%20%7B%0A%09--nav--menu-open-duration%3A%20400ms%3B%0A%09--nav--menu-close-duration%3A%20400ms%3B%0A%09--nav--dropdown-open-duration%3A%20400ms%3B%0A%09--nav--dropdown-close-duration%3A%20400ms%3B%0A%7D%0Abody%3Ahas(.nav_component%20.w-nav-button.w--open)%3Anot(%3Ahas(.nav_desktop_wrap%3Anot(.w-condition-invisible)))%20%7B%20overflow%3A%20hidden%3B%20%7D%0A%2F*%20on%20smaller%20screens%20*%2F%0A%40media%20(width%20%3C%2065em)%20%7B%0A%09%2F*%20disable%20scroll%20when%20mobile%20menu%20is%20open%20*%2F%0A%09body%3Ahas(.nav_component%20.w-nav-button.w--open)%20%7B%20overflow%3A%20hidden%3B%20%7D%0A%7D%0A%2F*%20on%20larger%20screens%20*%2F%0A%40container%20(min-width%3A%2065em)%20%7B%0A%09%2F*%20show%20desktop%20nav%20%26%20dropdown%20backdrop%20*%2F%0A%09.nav_desktop_wrap%2C%20.nav_dropdown_backdrop%20%7B%20display%3A%20block%3B%20%7D%0A%09%2F*%20hide%20mobile%20nav%20%26%20mobile%20menu%20backdrop%20*%2F%0A%09.nav_desktop_wrap%3Anot(.w-condition-invisible)%20~%20.nav_mobile_wrap%2C%20.nav_desktop_wrap%3Anot(.w-condition-invisible)%20~%20.nav_menu_backdrop%20%7B%20display%3A%20none%3B%20%7D%0A%7D%0A%2F*%20dropdown%20list%3A%20initial%20state%20*%2F%0Ahtml%3Anot(.wf-design-mode)%20.nav_dropdown_component%20%3E%20.w-dropdown-list%20%7B%0A%09%2F*%20removes%20display%20none%20to%20enable%20css%20transitions%20*%2F%0A%09display%3A%20grid%20!important%3B%0A%09grid-template-columns%3A%20minmax(0%2C%201fr)%3B%0A%09%2F*%20sets%20list%20to%200%20height%20by%20default%20*%2F%0A%09grid-template-rows%3A%200fr%3B%0A%09transition%3A%20grid-template-rows%20var(--nav--dropdown-close-duration)%3B%0A%09%2F*%20makes%20list%20content%20not%20focusable%20when%20closed%20*%2F%0A%09visibility%3A%20hidden%3B%0A%09opacity%3A%200%3B%0A%7D%0A%2F*%20makes%20list%20content%20focusable%20when%20opened%20*%2F%0Ahtml%3Anot(.wf-design-mode)%20.nav_dropdown_component%20%3E%20.w-dropdown-list.w--open%20%7B%0A%09visibility%3A%20visible%3B%0A%09opacity%3A%201%3B%0A%7D%0A%2F*%20sets%20list%20child%20to%20overflow%20hidden%20to%20enable%20css%20height%20transition%20*%2F%0A.nav_dropdown_component%20%3E%20.w-dropdown-list%20%3E%20*%20%7B%0A%09overflow%3A%20hidden%3B%0A%7D%0A%2F*%20set%20open%20state%20of%20dropdown%20list%20*%2F%0A.nav_dropdown_component%3Ahas(%3E%20.w-dropdown-toggle%5Baria-expanded%3D%22true%22%5D)%20%3E%20.w-dropdown-list%20%7B%0A%09--nav--dropdown-close-duration%3A%20var(--nav--dropdown-open-duration)%3B%0A%09grid-template-rows%3A%201fr%3B%0A%7D%0A%2F*%20on%20desktop%2C%20delay%20dropdown%20opening%20if%20another%20dropdown%20is%20open%20*%2F%0A.nav_desktop_wrap%3Ahas(.nav_dropdown_component%20%3E%20.w-dropdown-toggle.w--open%5Baria-expanded%3D%22false%22%5D)%20.nav_dropdown_component%3Ahas(%3E%20.w--open%5Baria-expanded%3D%22true%22%5D)%20%3E%20.w-dropdown-list%20%7B%0A%09transition-delay%3A%20var(--nav--dropdown-close-duration)%3B%0A%7D%0A%2F*%20reveal%20dropdown%20backdrop%20when%20dropdown%20open%20*%2F%0A.nav_dropdown_backdrop%20%7B%0A%09transition%3A%20opacity%20var(--nav--dropdown-close-duration)%3B%0A%7D%0A.nav_component%3Ahas(.nav_dropdown_component%20%3E%20%5Baria-expanded%3D%22true%22%5D)%20.nav_dropdown_backdrop%20%7B%0A%09opacity%3A%201%3B%0A%7D%0A%2F*%20reveal%20mobile%20menu%20backdrop%20on%20menu%20open%20*%2F%0A.nav_menu_backdrop%20%7B%0A%09transition%3A%20opacity%20var(--nav--menu-close-duration)%3B%0A%7D%0A.nav_component%3Ahas(.w-nav-button.w--open)%20.nav_menu_backdrop%20%7B%0A%09opacity%3A%201%3B%0A%7D%0A%2F*%20menu%20animations%20*%2F%0A%40keyframes%20menuOpen%20%7B%0A%20from%20%7B%20clip-path%3A%20polygon(0%200%2C%20100%25%200%2C%20100%25%200%2C%200%200)%3B%20%7D%0A%20to%20%7B%20clip-path%3A%20polygon(0%200%2C%20100%25%200%2C%20100%25%20100%25%2C%200%20100%25)%3B%20%7D%0A%7D%0A%40keyframes%20menuClose%20%7B%0A%20from%20%7B%20clip-path%3A%20polygon(0%200%2C%20100%25%200%2C%20100%25%20100%25%2C%200%20100%25)%3B%20%7D%0A%20to%20%7B%20clip-path%3A%20polygon(0%200%2C%20100%25%200%2C%20100%25%200%2C%200%200)%3B%20%7D%0A%7D%0A%2F*%20menu%20open%20*%2F%0A.nav_component%3Ahas(.w-nav-button.w--open)%20.w-nav-menu%20%7B%0A%09animation%3A%20menuOpen%20var(--nav--menu-open-duration)%20ease-in-out%20forwards%3B%0A%7D%0A%2F*%20menu%20close%20*%2F%0A.nav_component%3Ahas(.w-nav-button%3Anot(.w--open))%20.w-nav-menu%20%7B%0A%09animation%3A%20menuClose%20var(--nav--menu-close-duration)%20ease-in-out%20forwards%3B%0A%7D%0A%2F*%20position%20overflow%20to%20top%20of%20screen%20*%2F%0A.nav_component%20.w-nav-overlay%20%7B%0A%20top%3A%200%3B%0A%20min-height%3A%20100vh%3B%0A%7D%0A%2F*%20open%20dropdown%20on%20mobile%20*%2F%0A.nav_mobile_wrap%20%5Bdata-open-on-mobile%5D%20%3E%20.w-dropdown-toggle%20%7B%0A%09display%3A%20none%3B%0A%7D%0A.nav_mobile_wrap%20%5Bdata-open-on-mobile%5D%20%3E%20.w-dropdown-list%20%7B%0A%09visibility%3A%20visible%20!important%3B%0A%09opacity%3A%201%20!important%3B%0A%09display%3A%20block%20!important%3B%0A%09grid-template-rows%3A%201fr%20!important%3B%0A%7D%0A%2F*%20nav%20banner%20*%2F%0Ahtml%3Ahas(.nav_banner_wrap%3Anot(.w-condition-invisible))%3Anot(.hide-nav-banner)%20%7B%0A%09--nav--height-total%3A%20calc(var(--nav--banner-height)%20%2B%20var(--nav--height)%20%2B%20var(--nav--spacing-outer-vertical))%3B%0A%7D%0A.hide-nav-banner%20.nav_banner_wrap%20%7B%0A%09display%3A%20none%3B%0A%7D%0A.wf-design-mode%20.nav_mobile_menu_wrap%20%7B%0A%09width%3A%20100%25%3B%0A%7D%0A%3C%2Fstyle%3E"
      />
      <Link
        block="inline"
        button={false}
        className={_utils.cx(_styles, "nav_skip_wrap", _activeStyleVariant)}
        options={{
          href: "#main",
        }}
      >
        <Block
          className={_utils.cx(
            _styles,
            "nav_skip_text",
            "u-text-style-small",
            _activeStyleVariant
          )}
          tag="div"
        >
          {"Skip to main content"}
        </Block>
      </Link>
      <NavBanner />
      <Block
        className={_utils.cx(_styles, "nav_desktop_wrap", _activeStyleVariant)}
        tag="header"
      >
        <Block
          className={_utils.cx(
            _styles,
            "nav_desktop_contain",
            _activeStyleVariant
          )}
          tag="div"
        >
          <Block
            className={_utils.cx(
              _styles,
              "nav_desktop_layout",
              _activeStyleVariant
            )}
            tag="div"
          >
            <Link
              aria-label="Home Page"
              block="inline"
              button={false}
              className={_utils.cx(
                _styles,
                "nav_desktop_logo",
                _activeStyleVariant
              )}
              options={{
                href: "#",
              }}
            >
              <Logo />
            </Link>
            <Menu variant="Desktop" />
          </Block>
        </Block>
      </Block>
      <NavbarWrapper
        className={_utils.cx(_styles, "nav_mobile_wrap", _activeStyleVariant)}
        config={{
          easing: "ease",
          easing2: "ease",
          duration: 400,
          docHeight: false,
          noScroll: false,
          animation: "default",
          collapse: "all",
        }}
        tag="div"
      >
        <Block
          className={_utils.cx(
            _styles,
            "nav_mobile_contain",
            _activeStyleVariant
          )}
          tag="div"
        >
          <Block
            className={_utils.cx(
              _styles,
              "nav_mobile_layout",
              _activeStyleVariant
            )}
            tag="div"
          >
            <Link
              aria-label="Home Page"
              block="inline"
              button={false}
              className={_utils.cx(
                _styles,
                "nav_mobile_logo",
                _activeStyleVariant
              )}
              options={{
                href: "#",
              }}
            >
              <Logo />
            </Link>
            <NavbarMenu
              className={_utils.cx(
                _styles,
                "nav_mobile_menu_wrap",
                _activeStyleVariant
              )}
              role="navigation"
              tag="nav"
            >
              <Block
                className={_utils.cx(
                  _styles,
                  "nav_mobile_menu_scroll",
                  _activeStyleVariant
                )}
                data-lenis-prevent=""
                tag="div"
              >
                <Menu variant="Mobile" />
              </Block>
            </NavbarMenu>
            <NavbarButton
              className={_utils.cx(
                _styles,
                "nav_button_wrap",
                _activeStyleVariant
              )}
              data-state="open"
              tag="div"
            >
              <Block
                className={_utils.cx(
                  _styles,
                  "nav_button_layout",
                  _activeStyleVariant
                )}
                tag="div"
              >
                <Block
                  className={_utils.cx(
                    _styles,
                    "nav_button_line",
                    "is-1",
                    _activeStyleVariant
                  )}
                  tag="div"
                />
                <Block
                  className={_utils.cx(
                    _styles,
                    "nav_button_line",
                    "is-2",
                    _activeStyleVariant
                  )}
                  tag="div"
                />
              </Block>
            </NavbarButton>
          </Block>
        </Block>
      </NavbarWrapper>
      <Block
        className={_utils.cx(
          _styles,
          "nav_dropdown_backdrop",
          _activeStyleVariant
        )}
        tag="div"
      />
      <Block
        className={_utils.cx(_styles, "nav_menu_backdrop", _activeStyleVariant)}
        tag="div"
      />
      <HtmlEmbed
        className={_utils.cx(_styles, "u-embed-js", _activeStyleVariant)}
        content=""
        value="%3Cscript%3E%0Aif%20(sessionStorage.getItem(%22hide-nav-banner%22)%20%3D%3D%3D%20%22true%22)%20%7B%0A%20%20document.documentElement.classList.add(%22hide-nav-banner%22)%3B%0A%7D%0Adocument.addEventListener(%22DOMContentLoaded%22%2C%20function%20()%20%7B%0A%20%20document.querySelectorAll(%22.nav_banner_close_wrap%22).forEach((button)%20%3D%3E%20%7B%0A%20%20%20%20button.addEventListener(%22click%22%2C%20function%20()%20%7B%0A%20%20%20%20%20%20sessionStorage.setItem(%22hide-nav-banner%22%2C%20%22true%22)%3B%0A%20%20%20%20%20%20document.documentElement.classList.add(%22hide-nav-banner%22)%3B%0A%20%20%20%20%7D)%3B%0A%20%20%7D)%3B%0A%20%20document.querySelectorAll(%22.nav_skip_wrap%22).forEach(function%20(link)%20%7B%0A%20%20%20%20const%20target%20%3D%20document.querySelector(%22main%22)%3B%0A%20%20%20%20if%20(!target)%20return%3B%0A%20%20%20%20link.addEventListener(%22click%22%2C%20function%20()%20%7B%0A%20%20%20%20%20%20target.setAttribute(%22tabindex%22%2C%20%22-1%22)%3B%0A%20%20%20%20%20%20target.focus()%3B%0A%20%20%20%20%7D)%3B%0A%20%20%7D)%3B%0A%7D)%3B%0A%3C%2Fscript%3E"
      />
    </_Component>
  );
}
