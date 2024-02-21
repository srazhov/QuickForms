import React, { Dispatch } from "react";
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
export declare const UniversalForm: ({ className, formObject, setFormObject, onSubmitAsync, quickForms, allDisabled, needsValidation, clientValidationFunc, serverValidationFunc, children, }: UniversalFormProps) => React.JSX.Element;
export {};
