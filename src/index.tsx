import React, { Dispatch, useState } from "react";
import { FormGroup } from "./FormGroup";
import { QuickForm } from "./QuickForm";

interface UniversalFormProps {
  className: string;
  formObject: any;
  setFormObject: Dispatch<any>;
  onSubmitAsync: (e: any) => Promise<void>;
  quickForms: {};
  allDisabled: boolean;
  needsValidation: boolean;
  clientValidationFunc: (e: any) => {};
  serverValidationFunc: (e: any) => {};
}

export const UniversalForm = (
  {
    className = "",
    formObject,
    setFormObject,
    onSubmitAsync,
    quickForms,
    allDisabled = false,
    needsValidation = false,
    clientValidationFunc,
    serverValidationFunc,
  }: UniversalFormProps,
  children: React.ReactNode
) => {
  const [isValidated, setIsValidated] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});

  const checkValidation = (errors: any) => {
    if (!needsValidation) {
      return true;
    }

    setIsValidated(true);

    let clientErrors: {};
    if (errors) {
      clientErrors = serverValidationFunc(formObject);
    } else {
      clientErrors = clientValidationFunc(formObject);
    }

    setErrorMessages(clientErrors);

    return Object.keys(clientErrors).length === 0;
  };

  const onSubmitBtn = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (!checkValidation(null)) {
      return;
    }

    await onSubmitAsync(e).catch((reason: any) => {
      checkValidation(reason);
    });
  };

  const onValueChange = (name: string, val: any) => {
    if (isValidated) {
      checkValidation(null);
    }

    setFormObject({ ...formObject, [name]: val });
  };

  type errorMsgKey = keyof typeof errorMessages;
  type quickFormsKey = keyof typeof quickForms;

  return (
    <form className={`qf-universal-form ${className}`} onSubmit={onSubmitBtn}>
      {Object.keys(formObject)
        .filter(
          (name: string, _) =>
            (quickForms[name as quickFormsKey] as QuickForm).display !== false
        )
        .map((item: string, _) => (
          <FormGroup
            value={formObject[item]}
            disabled={allDisabled}
            quickForm={quickForms[item as quickFormsKey] as QuickForm}
            invalidMessage={errorMessages[item as errorMsgKey]}
            onValueChange={(val: any) => {
              onValueChange(item, val);
            }}
          />
        ))}
      {children}
    </form>
  );
};
