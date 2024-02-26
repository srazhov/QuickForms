import React, { useId } from "react";
import { QuickForm } from "./QuickForm";
import "./css/form-group.css";

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

  const properties: any = {
    id: quickForm.id ? quickForm.id : useId(),
    value,
    disabled: disabled || quickForm.specifics?.disabled,
  };

  const groupClassName = `qf-form-group ${
    quickForm.groupClassName ? quickForm.groupClassName : ""
  } ${invalidMessage ? "is-invalid" : ""}`
    .replace(/\s+/g, " ")
    .trim();

  if (typeof quickForm.type === "string") {
    if (quickForm.specifics) {
      for (const s in quickForm.specifics) {
        properties[s] = quickForm.specifics[s];
      }
    }

    properties.className = properties.className
      ? `qf-input ${properties.className}`.replace(/\s+/g, " ").trim()
      : "qf-input";

    if (quickForm.type === "checkbox" || quickForm.type === "radio") {
      properties.checked = properties.value;
      delete properties.value;

      properties.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange(e.target.checked);
      };
    } else {
      properties.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange(e.target.value);
      };
    }

    const label = quickForm.label ? (
      <label
        className={`qf-label ${
          quickForm.labelClass ? quickForm.labelClass : ""
        }`
          .replace(/\s+/g, " ")
          .trim()}
        htmlFor={properties.id}
      >
        {quickForm.label}
      </label>
    ) : null;

    return (
      <div className={groupClassName}>
        {label}
        <input type={quickForm.type} {...properties} />
        {invalidMessage && (
          <div className="qf-invalid-feedback">{invalidMessage}</div>
        )}
      </div>
    );
  }

  properties.onChange = onValueChange;
  properties.invalidMessage = invalidMessage;
  properties.className = groupClassName;
  properties.specifics = quickForm.specifics;
  properties.label = quickForm.label;
  return React.cloneElement(quickForm.type, properties);
};
