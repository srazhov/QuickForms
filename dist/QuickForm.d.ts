import React, { HTMLAttributes } from "react";
export interface QuickForm {
    display: boolean;
    className: string;
    placeholder: string;
    type: React.DetailedReactHTMLElement<HTMLAttributes<HTMLElement>, HTMLElement>;
    specifics: any;
}
