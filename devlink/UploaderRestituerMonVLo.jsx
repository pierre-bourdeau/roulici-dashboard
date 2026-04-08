"use client";
import React from "react";
import DOM from "./_Builtin/DOM";

export function UploaderRestituerMonVLo({ as: _Component = DOM }) {
  return (
    <_Component
      ctx-name="Restituer mon vélo"
      slot=""
      tag="uploader-Restituermonvélo"
    >
      <DOM
        camera-modes="photo, video"
        ctx-name="Restituer mon vélo"
        files-view-mode="list"
        group-output="true"
        img-only="false"
        locale-name="fr"
        multiple="true"
        multiple-max="0"
        multiple-min="0"
        pubkey="284efb0061721644d09b"
        slot=""
        source-list="local, url, camera, dropbox, gdrive"
        tag="uc-config"
        use-cloud-image-editor="false"
        user-agent-integration="Webflow/1.0.0"
      />
      <DOM
        class="uc-dark"
        ctx-name="Restituer mon vélo"
        data-uploadcare="true"
        headless="true"
        slot=""
        tag="uc-file-uploader-regular"
      >
        <DOM ctx-name="Restituer mon vélo" slot="" tag="uc-form-input" />
      </DOM>
      <DOM ctx-name="Restituer mon vélo" slot="" tag="uc-upload-ctx-provider" />
      <DOM
        ctx-name="Restituer mon vélo"
        slot=""
        style="display: block;"
        tag="span"
      >
        {" "}
      </DOM>
      <DOM
        ctx-name="Restituer mon vélo"
        slot=""
        style="padding: 8px 16px;"
        tag="button"
        type="button"
        ucuploadbtn="true"
      >
        {"Upload"}
      </DOM>
    </_Component>
  );
}
