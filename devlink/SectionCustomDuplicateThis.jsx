"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import Block2 from "./_Builtin/Block";
import DOM from "./_Builtin/DOM";
import { Block } from "./Block";
import { ButtonMain } from "./ButtonMain";
import { ButtonWrapper } from "./ButtonWrapper";
import { ContentWrapper } from "./ContentWrapper";
import { Spacer } from "./Spacer";
import { TypographyEyebrow } from "./TypographyEyebrow";
import { TypographyHeading } from "./TypographyHeading";
import { TypographyParagraph } from "./TypographyParagraph";
import { VisualImage } from "./VisualImage";
import { VisualVideo } from "./VisualVideo";

export function SectionCustomDuplicateThis({
  as: _Component = DOM,

  button1Link = {
    href: "#",
  },

  button1Text = "Button Text",

  button2Link = {
    href: "#",
  },

  button2Text = "Button Text",
  contentEyebrowText = "",
  contentHeadingText = "",
  contentParagraphText = "",
  imageFile = "https://cdn.prod.website-files.com/6997126cb058e11ff9371bd6/6997126fb058e11ff9371d1d_placeholder.svg",
  imageLoading = "lazy",
  imageVisibility = true,
  sectionId = "",
  sectionPaddingBottom = null,
  sectionPaddingTop = null,
  sectionTheme = "Inherit",
  sectionVisibility = true,
  videoUrl = "",
}) {
  const _styleVariantMap = {
    Inherit: "",
    Light: "w-variant-f3a81397-d460-3add-9beb-5ec7af47907a",
    Dark: "w-variant-b4d321b1-05d4-6b05-8ab2-dfbc2f41ee4e",
    Brand: "w-variant-bb2c68bd-fd74-aa1e-69b0-e84595dd4ec8",
  };

  const _activeStyleVariant = _styleVariantMap[sectionTheme];

  return sectionVisibility ? (
    <_Component
      className={_utils.cx(
        _styles,
        "section_wrap",
        "u-section",
        _activeStyleVariant
      )}
      id={sectionId}
      slot=""
      tag="section"
    >
      <Spacer variant={sectionPaddingTop} />
      <Block2
        className={_utils.cx(
          _styles,
          "section_contain",
          "u-container",
          _activeStyleVariant
        )}
        tag="div"
      >
        <Block2
          className={_utils.cx(
            _styles,
            "section_layout",
            "u-grid-autofit",
            _activeStyleVariant
          )}
          tag="div"
        >
          <ContentWrapper
            content={
              <>
                <TypographyEyebrow text={contentEyebrowText} />
                <TypographyHeading text={contentHeadingText} />
                <TypographyParagraph text={contentParagraphText} />
                <ButtonWrapper
                  content={
                    <>
                      <ButtonMain link={button1Link} text={button1Text} />
                      <ButtonMain
                        link={button2Link}
                        text={button2Text}
                        variant="Secondary"
                      />
                    </>
                  }
                />
              </>
            }
          />
          <Block
            classes="u-position-relative u-cover u-radius-small u-background-skeleton u-ratio-16-9 u-overflow-clip"
            content={
              <>
                <VisualImage
                  image={imageFile}
                  loading={imageLoading}
                  variant="Cover"
                  visibility={imageVisibility}
                />
                <VisualVideo classes=" " url={videoUrl} variant="Cover" />
              </>
            }
          />
        </Block2>
      </Block2>
      <Spacer variant={sectionPaddingBottom} />
    </_Component>
  ) : null;
}
