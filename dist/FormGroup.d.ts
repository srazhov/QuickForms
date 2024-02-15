import React from "react";
import { QuickForm } from "./QuickForm";
interface FormGroupProps {
    value: any;
    disabled: boolean;
    invalidMessage: string;
    quickForm: QuickForm;
    onValueChange: (e: any) => void;
}
export declare const FormGroup: ({ value, disabled, quickForm, onValueChange, invalidMessage, }: FormGroupProps) => React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
export {};
