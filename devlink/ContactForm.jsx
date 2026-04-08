"use client";
import React from "react";
import _styles from "./css/classes.module.css";
import * as _utils from "./utils";
import Block from "./_Builtin/Block";
import DOM from "./_Builtin/DOM";
import FormErrorMessage from "./_Builtin/FormErrorMessage";
import FormForm from "./_Builtin/FormForm";
import FormSuccessMessage from "./_Builtin/FormSuccessMessage";
import FormWrapper from "./_Builtin/FormWrapper";
import { ButtonMain } from "./ButtonMain";
import { ButtonWrapper } from "./ButtonWrapper";
import { FormCheckbox } from "./FormCheckbox";
import { FormFieldset } from "./FormFieldset";
import { FormInput } from "./FormInput";
import { FormRadio } from "./FormRadio";
import { FormRange } from "./FormRange";
import { FormSelect } from "./FormSelect";
import { FormSelectOption } from "./FormSelectOption";
import { FormTextarea } from "./FormTextarea";

export function ContactForm({
  as: _Component = DOM,
  classes = " ",
  visibility = true,
}) {
  return visibility ? (
    <_Component
      class={classes}
      className={_utils.cx(_styles, "form_component")}
      slot=""
      tag="div"
    >
      <FormWrapper className={_utils.cx(_styles, "form_wrap")}>
        <FormForm
          className={_utils.cx(_styles, "form_element")}
          data-name="Contact Form"
          id={_utils.cx(_styles, "wf-form-Contact-Form")}
          method="get"
          name="wf-form-Contact-Form"
        >
          <FormFieldset
            content={
              <>
                <FormInput
                  autoComplete="given-name"
                  label="First Name"
                  name="First Name"
                  placeholder="First name"
                />
                <FormInput
                  autoComplete="family-name"
                  label="Last Name"
                  name="Last Name"
                  placeholder="Last name"
                />
                <FormInput
                  autoComplete="email"
                  inputMode="email"
                  label="Email Address"
                  name="Email Address"
                  placeholder="email@company.com"
                  type="email"
                />
                <FormFieldset
                  content={
                    <>
                      <FormSelect
                        classes="u-column-span-2"
                        formSelectOption={
                          <>
                            <FormSelectOption text="Select one..." value="" />
                            <FormSelectOption
                              text="Option 1"
                              value="Option 1"
                            />
                            <FormSelectOption
                              text="Option 2"
                              value="Option 2"
                            />
                            <FormSelectOption
                              text="Option 3"
                              value="Option 3"
                            />
                          </>
                        }
                        label="State"
                        name="State"
                      />
                      <FormInput
                        autoComplete="postal-code"
                        inputMode="text"
                        label="Zip Code"
                        name="Zip Code"
                        placeholder=""
                        type="text"
                      />
                    </>
                  }
                  legendText="Address"
                  legendVariant="Hidden"
                  variant="Grid 3 Column"
                />
                <FormFieldset
                  content={
                    <>
                      <FormSelect
                        formSelectOption={
                          <>
                            <FormSelectOption text="MM" value="" />
                            <FormSelectOption text="January" value="January" />
                            <FormSelectOption
                              text="February"
                              value="February"
                            />
                            <FormSelectOption text="March" value="March" />
                            <FormSelectOption text="April" value="April" />
                            <FormSelectOption text="May" value="May" />
                            <FormSelectOption text="June" value="June" />
                            <FormSelectOption text="July" value="July" />
                            <FormSelectOption text="August" value="August" />
                            <FormSelectOption
                              text="September"
                              value="September"
                            />
                            <FormSelectOption text="October" value="October" />
                            <FormSelectOption
                              text="November"
                              value="November"
                            />
                            <FormSelectOption
                              text="December"
                              value="December"
                            />
                          </>
                        }
                        label="Month"
                        labelVariant="Hidden"
                        name="Month"
                      />
                      <FormSelect
                        formSelectOption={
                          <>
                            <FormSelectOption text="DD" value="" />
                            <FormSelectOption text="1" value="1" />
                            <FormSelectOption text="2" value="2" />
                            <FormSelectOption text="3" value="3" />
                          </>
                        }
                        label="Day"
                        labelVariant="Hidden"
                        name="Day"
                      />
                      <FormSelect
                        formSelectOption={
                          <>
                            <FormSelectOption text="YYYY" value="" />
                            <FormSelectOption text="2025" value="2025" />
                            <FormSelectOption text="2024" value="2024" />
                            <FormSelectOption text="2023" value="2023" />
                          </>
                        }
                        label="Year"
                        labelVariant="Hidden"
                        name="Year"
                      />
                    </>
                  }
                  legendText="Date of Birth"
                  variant="Grid 3 Column"
                />
                <FormInput
                  autoComplete="tel"
                  inputMode="tel"
                  label="Phone Number"
                  name="Phone Number"
                  placeholder="000-000-0000"
                  type="tel"
                />
              </>
            }
            legendText="Contact Details"
            legendVariant="Bold"
            variant="Grid 2 Column"
          />
          <FormFieldset
            content={
              <>
                <FormFieldset
                  content={
                    <>
                      <FormRadio
                        checked=" "
                        groupName="Color"
                        label="Red"
                        required=" "
                        role="listitem"
                        value="Red"
                        variant="Radio"
                      />
                      <FormRadio
                        groupName="Color"
                        label="Green"
                        required=" "
                        role="listitem"
                        value="Green"
                        variant="Radio"
                      />
                      <FormRadio
                        groupName="Color"
                        label="Blue"
                        required=" "
                        role="listitem"
                        value="Blue"
                        variant="Radio"
                      />
                    </>
                  }
                  legendText="Favorite Color"
                  slotRole="list"
                  variant="Flex Horizontal"
                />
                <FormFieldset
                  content={
                    <>
                      <FormCheckbox
                        checked=" "
                        label="I agree to the terms"
                        name="I agree to the terms"
                        role="listitem"
                      />
                      <FormCheckbox
                        label="I agree to the terms"
                        name="I agree to the terms"
                        role="listitem"
                      />
                    </>
                  }
                  legendText="Terms & Conditions"
                  slotRole="list"
                  variant="Flex Horizontal"
                />
                <FormSelect
                  formSelectOption={
                    <>
                      <FormSelectOption text="Select one..." value="" />
                      <FormSelectOption />
                      <FormSelectOption text="Option 2" value="Option 2" />
                      <FormSelectOption text="Option 3" value="Option 3" />
                    </>
                  }
                  label="Job Title"
                  name="Job Title"
                />
                <FormInput
                  autoComplete=""
                  inputMode=""
                  label="Completion Date"
                  name="Completion Date"
                  placeholder=""
                  type="date"
                />
                <FormRange />
                <FormTextarea
                  classes="u-column-2"
                  label="Message"
                  name="Message"
                  placeholder="Your message"
                />
              </>
            }
            legendText="Project Details"
            legendVariant="Bold"
            variant="Grid 2 Column"
          />
          <ButtonWrapper
            classes="u-margin-top-0"
            content={<ButtonMain text="Submit" type="submit" />}
          />
        </FormForm>
        <FormSuccessMessage className={_utils.cx(_styles, "form_success_wrap")}>
          <Block className={_utils.cx(_styles, "form_success_text")} tag="div">
            {"Thank you! Your submission has been received!"}
          </Block>
        </FormSuccessMessage>
        <FormErrorMessage className={_utils.cx(_styles, "form_error_wrap")}>
          <Block className={_utils.cx(_styles, "form_error_text")} tag="div">
            {"Oops! Something went wrong while submitting the form."}
          </Block>
        </FormErrorMessage>
      </FormWrapper>
    </_Component>
  ) : null;
}
