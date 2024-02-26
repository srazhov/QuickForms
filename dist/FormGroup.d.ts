import React from "react";
import { QuickForm } from "./QuickForm";
import "./css/form-group.css";
interface FormGroupProps {
    value: any;
    disabled: boolean;
    invalidMessage: string;
    quickForm: QuickForm;
    onValueChange: (e: any) => void;
}
export declare const FormGroup: ({ value, disabled, invalidMessage, onValueChange, quickForm, }: FormGroupProps) => React.JSX.Element;
export {};
