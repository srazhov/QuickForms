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
  quickForm,
  onValueChange,
  invalidMessage,
}: FormGroupProps) => {
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

  return React.cloneElement(quickForm.type, properties);
};
