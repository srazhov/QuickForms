import React from "react";
import { QuickForm } from "./QuickForm";

interface FormGroupProps {
  value: any;
  disabled: boolean;
  invalidMessage: string;
  quickForm: QuickForm;
  onValueChange: (e: any) => void;
}

export const FormGroup = ({
  value,
  disabled,
  invalidMessage,
  onValueChange,
  quickForm,
}: FormGroupProps) => {
  if (!quickForm || !quickForm.type) {
    throw new Error("quickForm or its type must not be undefined");
  }

  const properties = {
    value,
    disabled,
    placeholder: quickForm.placeholder,
    specifics: quickForm.specifics,
    className: `qf-form-group ${quickForm.className} ${
      invalidMessage ? "is-invalid" : ""
    }`,
    onChange: onValueChange,
  };

  if (typeof quickForm.type === "string") {
    return <input type={quickForm.type} {...properties} />;
  }

  return React.cloneElement(quickForm.type, properties);
};
