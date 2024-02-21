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
  serverValidationFunc: (serverErrors: any, formObject: any) => {};
  children: React.ReactNode;
}

export const UniversalForm = ({
  className = "",
  formObject,
  setFormObject,
  onSubmitAsync,
  quickForms,
  allDisabled = false,
  needsValidation = false,
  clientValidationFunc,
  serverValidationFunc,
  children,
}: UniversalFormProps) => {
  if (!quickForms || !formObject || !setFormObject) {
    throw new Error(
      "quickForms, formObject or setFormObject must not be undefined"
    );
  }

  const [isValidated, setIsValidated] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});

  const checkValidation = (serverErrors: any) => {
    if (!needsValidation) {
      return true;
    }

    setIsValidated(true);

    let errors = {};
    if (serverErrors && serverValidationFunc) {
      errors = serverValidationFunc(serverErrors, formObject);
      console.error(serverErrors);
    } else if (clientValidationFunc) {
      errors = clientValidationFunc(formObject);
    }

    errors = errors ?? {};
    setErrorMessages(errors);

    return Object.keys(errors).length === 0;
  };

  const onSubmitBtn = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (!checkValidation(null)) {
      return;
    }

    if (!onSubmitAsync) {
      return;
    }

    await onSubmitAsync(formObject).catch((reason: any) => {
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
    <form
      className={`qf-universal-form ${className ? className : ""}`}
      onSubmit={onSubmitBtn}
      noValidate
    >
      {Object.keys(formObject)
        .filter(
          (name: string, _) =>
            (quickForms[name as quickFormsKey] as QuickForm).display !== false
        )
        .map((item: string, index: number) => (
          <FormGroup
            value={formObject[item]}
            disabled={allDisabled}
            quickForm={quickForms[item as quickFormsKey] as QuickForm}
            invalidMessage={errorMessages[item as errorMsgKey]}
            onValueChange={(val: any) => {
              onValueChange(item, val);
            }}
            key={`qf-form-group-${index}-${item}`}
          />
        ))}
      {children}
    </form>
  );
};
