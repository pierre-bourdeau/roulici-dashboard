"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import HtmlEmbed from "./_Builtin/HtmlEmbed";

export function StarterJs({ as: _Component = HtmlEmbed }) {
  return (
    <_Component
      className={_utils.cx(_styles, "u-embed-js")}
      content=""
      value="%3Cscript%3E%0Adocument.addEventListener(%22DOMContentLoaded%22%2C%20function%20()%20%7B%0A%20%20document.querySelectorAll(%22.your-element%22).forEach((component)%20%3D%3E%20%7B%0A%20%20%20%20if%20(component.dataset.scriptInitialized)%20return%3B%0A%20%20%20%20component.dataset.scriptInitialized%20%3D%20%22true%22%3B%0A%20%20%20%20%2F%2F%20run%20script%20here%0A%20%20%7D)%3B%0A%7D)%3B%0A%3C%2Fscript%3E"
    />
  );
}
