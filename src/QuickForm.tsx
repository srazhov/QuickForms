import React, { HTMLAttributes } from "react";

export interface QuickForm {
  id: string;
  display: boolean;
  groupClassName: string;
  label: string;
  labelClass: string;
  type: React.DetailedReactHTMLElement<
    HTMLAttributes<HTMLElement>,
    HTMLElement
  >;
  specifics: any;
}
